import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import CancellationRequest from "@/models/cancellationRequestModel"
import Order from "@/models/orderModel"
import { sendEmail } from "@/utils/sendMail"
import { AdminAuth } from "@/utils/adminAuth"

export async function POST(req, { params }) {
  await connect()
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
    const order = await Order.findById(cancellationRequest.orderId)
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Update cancellation request
    cancellationRequest.status = "REJECTED"
    cancellationRequest.adminNote = adminNote || "Cancellation rejected"
    cancellationRequest.processedAt = new Date()
    cancellationRequest.processedBy = adminId
    await cancellationRequest.save()

    // Update order to record the rejection
    order.cancellationStatus = "REJECTED"
    order.adminNote = adminNote || "Cancellation request rejected by admin"
    await order.save()

    // Send notification to customer
    const customerNotificationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #BC264B;">Your Order Cancellation Request was Declined</h2>
        <p>We regret to inform you that we are unable to approve your request to cancel order #${order.orderNumber}.</p>
        <p><strong>Order Details:</strong></p>
        <ul>
          <li>Order Number: ${order.orderNumber}</li>
          <li>Current Status: ${order.orderStatus}</li>
        </ul>
        ${adminNote ? `<p><strong>Reason:</strong> ${adminNote}</p>` : ""}
        <p>If you have any questions or would like to discuss this further, please contact our customer support team.</p>
        <p>Thank you for shopping with Jenii.</p>
      </div>
    `

    await sendEmail(
      order.shippingAddress.email,
      `Cancellation Request Declined for Order #${order.orderNumber}`,
      customerNotificationHtml,
    )

    return NextResponse.json(
      {
        success: true,
        message: "Cancellation request rejected",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error rejecting cancellation request:", error)
    return NextResponse.json({ message: "Error processing rejection", error: error.message }, { status: 500 })
  }
}
