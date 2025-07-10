import Order from "@/models/orderModel"
import { NextResponse } from "next/server"
import { verifyShiprocketWebhook } from "@/utils/adminUtils"
import { sendEmail, generateOrderStatusEmail } from "@/utils/sendMail"
import { connectToDB } from "@/db"

export async function POST(req) {
  await connectToDB()

  try {
    // Get the webhook payload and signature
    const payload = await req.json()
    const signature = req.headers.get("x-shiprocket-signature")

    // Verify webhook signature (implement this based on Shiprocket's documentation)
    const isValid = await verifyShiprocketWebhook(signature, payload)
    if (!isValid) {
      return NextResponse.json({ message: "Invalid webhook signature" }, { status: 401 })
    }

    // Process the webhook based on event type
    const { event, data } = payload

    switch (event) {
      case "awb_assigned":
        await handleAwbAssigned(data)
        break
      case "shipment_pickup_scheduled":
      case "shipment_pickup_generated":
      case "shipment_pickup_completed":
        await handlePickupUpdate(data, event)
        break
      case "shipment_dispatched":
      case "shipment_in_transit":
        await handleInTransitUpdate(data, event)
        break
      case "shipment_delivered":
        await handleDelivered(data)
        break
      case "shipment_cancelled":
      case "shipment_returned":
        await handleCancellationOrReturn(data, event)
        break
      default:
        console.log(`Unhandled Shiprocket webhook event: ${event}`)
    }

    return NextResponse.json({ message: "Webhook processed successfully" })
  } catch (error) {
    console.error("Error processing Shiprocket webhook:", error)
    return NextResponse.json({ message: "Error processing webhook", error: error.message }, { status: 500 })
  }
}

// Handle AWB assignment
async function handleAwbAssigned(data) {
  const { order_id, awb_code, courier_name, tracking_url } = data

  // Find the order by Shiprocket order ID
  const order = await Order.findOne({ "shipping.shippingOrderId": order_id })
  if (!order) {
    console.error(`Order not found for Shiprocket order ID: ${order_id}`)
    return
  }

  // Update order with AWB and tracking information
  order.shipping.awb = awb_code
  order.shipping.courier.name = courier_name
  order.shipping.trackingUrl = tracking_url

  await order.save()

  // Send email notification to customer
  const email = order.userId ? (await order.populate("userId")).userId.email : order.shippingAddress.email
  if (email) {
    const emailHtml = generateOrderStatusEmail(order, "AWB_ASSIGNED", {
      awb: awb_code,
      courier: courier_name,
      trackingUrl: tracking_url,
    })

    try {
      await sendEmail(email, `JENII - Tracking Information for Order #${order.orderNumber}`, emailHtml)
    } catch (error) {
      console.error("Error sending AWB assignment email:", error)
    }
  }
}

// Handle pickup updates
async function handlePickupUpdate(data, event) {
  const { order_id } = data

  // Find the order by Shiprocket order ID
  const order = await Order.findOne({ "shipping.shippingOrderId": order_id })
  if (!order) {
    console.error(`Order not found for Shiprocket order ID: ${order_id}`)
    return
  }

  // Update order status if needed
  if (order.orderStatus === "CONFIRMED") {
    order.orderStatus = "SHIPPED"
    order.shipping.shippedDate = new Date()
    await order.save()

    // Send email notification to customer
    const email = order.userId ? (await order.populate("userId")).userId.email : order.shippingAddress.email
    if (email) {
      const emailHtml = generateOrderStatusEmail(order, "SHIPPED")

      try {
        await sendEmail(email, `JENII - Your Order #${order.orderNumber} Has Been Shipped`, emailHtml)
      } catch (error) {
        console.error("Error sending shipment email:", error)
      }
    }
  }
}

// Handle in-transit updates
async function handleInTransitUpdate(data, event) {
  const { order_id } = data

  // Find the order by Shiprocket order ID
  const order = await Order.findOne({ "shipping.shippingOrderId": order_id })
  if (!order) {
    console.error(`Order not found for Shiprocket order ID: ${order_id}`)
    return
  }

  // Update order status if needed
  if (order.orderStatus !== "SHIPPED") {
    order.orderStatus = "SHIPPED"
    order.shipping.shippedDate = new Date()
    await order.save()
  }
}

// Handle delivered status
async function handleDelivered(data) {
  const { order_id } = data

  // Find the order by Shiprocket order ID
  const order = await Order.findOne({ "shipping.shippingOrderId": order_id })
  if (!order) {
    console.error(`Order not found for Shiprocket order ID: ${order_id}`)
    return
  }

  // Update order status
  order.orderStatus = "DELIVERED"
  order.shipping.deliveredDate = new Date()
  await order.save()

  // Send email notification to customer
  const email = order.userId ? (await order.populate("userId")).userId.email : order.shippingAddress.email
  if (email) {
    const emailHtml = generateOrderStatusEmail(order, "DELIVERED")

    try {
      await sendEmail(email, `JENII - Your Order #${order.orderNumber} Has Been Delivered`, emailHtml)
    } catch (error) {
      console.error("Error sending delivery email:", error)
    }
  }
}

// Handle cancellation or return
async function handleCancellationOrReturn(data, event) {
  const { order_id } = data

  // Find the order by Shiprocket order ID
  const order = await Order.findOne({ "shipping.shippingOrderId": order_id })
  if (!order) {
    console.error(`Order not found for Shiprocket order ID: ${order_id}`)
    return
  }

  // Update order status
  if (event === "shipment_cancelled") {
    order.orderStatus = "CANCELLED"
    order.cancelledDate = new Date()
  } else if (event === "shipment_returned") {
    order.orderStatus = "RETURNED"
    order.returnedDate = new Date()
  }

  await order.save()

  // Send email notification to customer
  const email = order.userId ? (await order.populate("userId")).userId.email : order.shippingAddress.email
  if (email) {
    const emailHtml = generateOrderStatusEmail(order, order.orderStatus)

    try {
      await sendEmail(email, `JENII - Update for Order #${order.orderNumber}`, emailHtml)
    } catch (error) {
      console.error("Error sending status update email:", error)
    }
  }
}
