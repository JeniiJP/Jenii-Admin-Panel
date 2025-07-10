import { connectToDB } from "@/db"
import Order from "@/models/orderModel"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { NextResponse } from "next/server"

export async function PUT(req, { params }) {
  await connectToDB()

  // Check admin authentication
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = params
    const { status, comment } = await req.json()

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Get the order
    const order = await Order.findById(id)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const previousStatus = order.orderStatus

    // Update order status
    order.orderStatus = status
    order.updatedAt = new Date()

    // Add status change to history
    if (!order.statusHistory) {
      order.statusHistory = []
    }

    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      comment: comment || `Status updated from ${previousStatus} to ${status}`,
      updatedBy: "admin",
    })

    // Update specific date fields based on status
    switch (status) {
      case "CONFIRMED":
        order.confirmedDate = new Date()
        break
      case "SHIPPED":
        order.shipping.shippedDate = new Date()
        break
      case "DELIVERED":
        order.shipping.deliveredDate = new Date()
        break
      case "CANCELLED":
        order.cancelledDate = new Date()
        if (comment) {
          order.cancellationReason = comment
        }
        break
      case "RETURNED":
        order.returnedDate = new Date()
        if (comment) {
          order.returnReason = comment
        }
        break
    }

    await order.save()

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        previousStatus,
        newStatus: status,
        updatedAt: order.updatedAt,
      },
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json(
      {
        error: "Failed to update order status",
        message: error.message,
      },
      { status: 500 },
    )
  }
}
