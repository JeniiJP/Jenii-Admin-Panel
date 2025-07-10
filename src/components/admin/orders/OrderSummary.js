import { Clock, Package, Truck, CheckCircle, Calendar } from "lucide-react"

export default function OrderSummary({
  pendingOrders,
  confirmedOrders,
  shippedOrders,
  deliveredOrders,
  totalOrders,
  todayOrders,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-yellow-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Orders</p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{pendingOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
            <Package className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmed Orders</p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{confirmedOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-purple-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
            <Truck className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipped Orders</p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{shippedOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered Orders</p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{deliveredOrders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 border-indigo-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-4">
            <Calendar className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Orders</p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{todayOrders}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
