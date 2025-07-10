import { NextResponse } from "next/server"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import CancellationRequest from "@/models/cancellationRequestModel"
import Product from "@/models/productModel"
import { cancelShipment, requestRTO } from "@/utils/shipRocket"
import { sendEmail } from "@/utils/sendMail"
import { AdminAuth } from "@/utils/adminAuth"
import { connectToDB } from "@/db"

export async function POST(req, { params }) {
  await connectToDB()
  try {
    const { id } = params
    const { adminNote } = await req.json()

    // Authenticate admin
    const adminId = await AdminAuth()
    if (!adminId) {
      return NextResponse.json({ message: "Admin authentication required" }, { status: 401 })
    }

    // Find the cancellation request
    const cancellationRequest = await CancellationRequest.findById(id)
    if (!cancellationRequest) {
      return NextResponse.json({ message: "Cancellation request not found" }, { status: 404 })
    }

    // Check if request is already processed
    if (cancellationRequest.status !== "PENDING") {
      return NextResponse.json(
        {
          message: `This request has already been ${cancellationRequest.status.toLowerCase()}`,
          status: cancellationRequest.status,
        },
        { status: 400 },
      )
    }

    // Find the order
    const order = await Order.findById(cancellationRequest.orderId).populate("items")
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Process cancellation based on order status
    let cancellationResult = null
    let newOrderStatus = "CANCELLED"
    let actionTaken = "cancelled"

    try {
      if (["PENDING", "CONFIRMED", "PROCESSING"].includes(order.orderStatus)) {
        // For orders not yet shipped, cancel the shipment in ShipRocket
        if (order.shipping?.shipmentID) {
          cancellationResult = await cancelShipment(order.shipping.shippingOrderId)
        }
      } else if (["SHIPPED"].includes(order.orderStatus)) {
        // For shipped orders, initiate RTO
        if (order.shipping?.awb) {
          cancellationResult = await requestRTO(order.shipping.awb)
          newOrderStatus = "RTO_INITIATED"
          actionTaken = "marked for return to origin (RTO)"
        }
      } else {
        // For other statuses, just mark as cancelled in our system
        console.log(`Order ${order.orderNumber} in status ${order.orderStatus} - cancelling locally only`)
      }
    } catch (error) {
      console.error("Error with ShipRocket operation:", error)
      // Continue with local cancellation even if ShipRocket operation fails
    }

    // Update order status
    order.orderStatus = newOrderStatus
    order.cancellationReason = cancellationRequest.reason
    order.cancellationStatus = "APPROVED"
    order.cancellationDate = new Date()
    order.adminNote = adminNote || "Cancellation approved by admin"
    await order.save()

    // Update order items status
    await OrderItem.updateMany({ orderId: order._id }, { $set: { status: newOrderStatus } })

    // If order is fully cancelled (not RTO), restore product stock
    if (newOrderStatus === "CANCELLED") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } })
      }
    }

    // Update cancellation request
    cancellationRequest.status = "APPROVED"
    cancellationRequest.adminNote = adminNote || "Cancellation approved"
    cancellationRequest.processedAt = new Date()
    cancellationRequest.processedBy = adminId
    await cancellationRequest.save()

    // Send notification to customer
    const customerNotificationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #BC264B;">Your Order Cancellation Request is Approved</h2>
        <p>We have approved your request to cancel order #${order.orderNumber}.</p>
        <p>Your order has been ${actionTaken}.</p>
        ${
          newOrderStatus === "RTO_INITIATED"
            ? `<p>Since your order was already shipped, we have initiated a return to origin (RTO) process. 
          You don't need to accept the package when it arrives.</p>`
            : `<p>Any payment you made will be refunded according to our refund policy.</p>`
        }
        <p><strong>Order Details:</strong></p>
        <ul>
          <li>Order Number: ${order.orderNumber}</li>
          <li>Cancellation Date: ${new Date().toLocaleDateString()}</li>
          <li>New Status: ${newOrderStatus}</li>
        </ul>
        ${adminNote ? `<p><strong>Note from our team:</strong> ${adminNote}</p>` : ""}
        <p>If you have any questions, please contact our customer support.</p>
        <p>Thank you for shopping with Jenii.</p>
      </div>
    `

    await sendEmail(
      order.shippingAddress.email,
      `Cancellation Approved for Order #${order.orderNumber}`,
      customerNotificationHtml,
    )

    return NextResponse.json(
      {
        success: true,
        message: `Cancellation request approved. Order ${actionTaken}.`,
        orderStatus: newOrderStatus,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error approving cancellation request:", error)
    return NextResponse.json({ message: "Error processing approval", error: error.message }, { status: 500 })
  }
}
