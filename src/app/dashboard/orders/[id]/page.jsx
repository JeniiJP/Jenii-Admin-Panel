import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import User from "@/models/userModel"
import Payment from "@/models/paymentModel"
// import AdminLayout from "@/components/admin/AdminLayout"
import OrderDetailsHeader from "@/components/admin/orders/OrderDetailsHeader"
import OrderStatusTimeline from "@/components/admin/orders/OrderStatusTimeline"
import CustomerInfo from "@/components/admin/orders/CustomerInfo"
import ShippingInfo from "@/components/admin/orders/ShippingInfo"
import PaymentInfo from "@/components/admin/orders/PaymentInfo"
import OrderItems from "@/components/admin/orders/OrderItems"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { redirect, notFound } from "next/navigation"
import { connectToDB } from "@/db"

export const dynamic = "force-dynamic"

export default async function OrderDetails({ params }) {
  await connectToDB()

  // Check admin authentication
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  // Get order details
  const order = await Order.findById(params.id)
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

  if (!order) {
    notFound()
  }

  return (
    // <AdminLayout>
      <div className="container mx-auto px-4 py-8 dark:bg-[#424242]">
        <OrderDetailsHeader
          orderId={order._id.toString()}
          orderNumber={order.orderNumber}
          orderDate={order.createdAt}
          orderStatus={order.orderStatus}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <OrderItems items={order.items} />
            <OrderStatusTimeline
              orderId={order._id.toString()}
              status={order.orderStatus}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
              shippingDetails={order.shipping}
            />
          </div>

          <div className="space-y-6">
            <CustomerInfo customer={order.userId} />
            <ShippingInfo
              shippingAddress={order.shippingAddress}
              billingAddress={order.billingAddress}
              shippingDetails={order.shipping}
            />
            <PaymentInfo
              payment={order.payment}
              paymentDetails={order.payment.paymentId}
              subtotal={order.subtotal}
              shippingCost={order.shippingCost}
              discount={order.discount}
              totalAmount={order.totalAmount}
            />
          </div>
        </div>
      </div>
    // </AdminLayout>
  )
}
