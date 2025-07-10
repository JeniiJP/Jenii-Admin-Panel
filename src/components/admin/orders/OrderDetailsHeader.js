"use client"

import Link from "next/link"
import { ChevronLeft, FileText, Printer } from "lucide-react"
import { formatDate } from "@/utils/productDiscount"
import OrderStatusBadge from "./OrderStatusBadge"

export default function OrderDetailsHeader({ orderId, orderNumber, orderDate, orderStatus }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          Order #{orderNumber}
          <OrderStatusBadge status={orderStatus} className="ml-3" />
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Placed on {formatDate(orderDate)}</p>
      </div>

      <div className="flex space-x-2 mt-4 sm:mt-0">
        {/* <Link
          href={`/api/orders/${orderId}/invoice`}
          target="_blank"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FileText className="h-4 w-4 mr-2" />
          Download Invoice
        </Link> */}

        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </button>
      </div>
    </div>
  )
}
