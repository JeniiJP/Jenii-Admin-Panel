import { connectToDB } from "@/db"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import User from "@/models/userModel"
import Payment from "@/models/paymentModel"
import OrdersTable from "@/components/admin/orders/OrdersTable"
import OrderSummary from "@/components/admin/orders/OrderSummary"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminOrders({ searchParams }) {
  await connectToDB()

  // Check admin authentication
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  // Get pagination parameters
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit) : 10
  const skip = (page - 1) * limit

  // Get search and filter parameters
  const search = searchParams.search || ""
  const status = searchParams.status || ""
  const dateRange = searchParams.dateRange || ""

  // Build query
  let query = {}

  if (search) {
    query = {
      $or: [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.name": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
      ],
    }
  }

  if (status) {
    query.orderStatus = status
  }

  if (dateRange) {
    const [startDate, endDate] = dateRange.split(",")
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }
  }

  // Get total count for pagination
  const totalOrders = await Order.countDocuments(query)
  const totalPages = Math.ceil(totalOrders / limit)

  // Get orders with pagination
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "items",
      model: OrderItem,
    })
    .populate({
      path: "userId",
      model: User,
      select: "name email phone image",
    })
    .populate({
      path: "payment.paymentId",
      model: Payment,
    })
    .lean()

  // Get summary counts
  const pendingOrders = await Order.countDocuments({ orderStatus: "PENDING" })
  const confirmedOrders = await Order.countDocuments({ orderStatus: "CONFIRMED" })
  const shippedOrders = await Order.countDocuments({ orderStatus: "SHIPPED" })
  const deliveredOrders = await Order.countDocuments({ orderStatus: "DELIVERED" })

  // Get today's orders
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayOrders = await Order.countDocuments({
    createdAt: {
      $gte: today,
      $lt: tomorrow,
    },
  })

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Order Management</h1>

        <OrderSummary
          pendingOrders={pendingOrders}
          confirmedOrders={confirmedOrders}
          shippedOrders={shippedOrders}
          deliveredOrders={deliveredOrders}
          totalOrders={totalOrders}
          todayOrders={todayOrders}
        />

        <OrdersTable
          orders={orders}
          currentPage={page}
          totalPages={totalPages}
          limit={limit}
          search={search}
          status={status}
          dateRange={dateRange}
        />
      </div>
  )
}
