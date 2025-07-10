"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Calendar,
  FileText,
  Package,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/utils/productDiscount"
import OrderStatusBadge from "./OrderStatusBadge"
import { exportOrdersToCSV } from "@/utils/exportUtils"

export default function OrdersTable({ orders, currentPage, totalPages, limit, search, status, dateRange }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(search)
  const [statusFilter, setStatusFilter] = useState(status)
  const [isExporting, setIsExporting] = useState(false)
  const [dateRangeFilter, setDateRangeFilter] = useState(dateRange)

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    params.set("page", "1")
    router.push(`/admin/orders?${params.toString()}`)
  }

  // Handle status filter
  const handleStatusFilter = (e) => {
    const newStatus = e.target.value
    setStatusFilter(newStatus)

    const params = new URLSearchParams(searchParams)
    if (newStatus) {
      params.set("status", newStatus)
    } else {
      params.delete("status")
    }
    params.set("page", "1")
    router.push(`/admin/orders?${params.toString()}`)
  }

  // Handle date range filter
  const handleDateRangeFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (dateRangeFilter) {
      params.set("dateRange", dateRangeFilter)
    } else {
      params.delete("dateRange")
    }
    params.set("page", "1")
    router.push(`/admin/orders?${params.toString()}`)
  }

  // Handle pagination
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/admin/orders?${params.toString()}`)
  }

  // Handle export to CSV
  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      await exportOrdersToCSV(orders)
    } catch (error) {
      console.error("Error exporting orders:", error)
      alert("Failed to export orders. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex w-full lg:w-auto">
            <div className="relative flex-grow lg:w-80">
              <input
                type="text"
                placeholder="Search by order #, name or email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all duration-200"
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <button
              type="submit"
              className="ml-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Search
            </button>
          </form>

          {/* Filters and Export */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Status Filter */}
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <select
                className="rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white px-4 py-3 min-w-[140px] transition-all duration-200"
                value={statusFilter || ""}
                onChange={handleStatusFilter}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURNED">Returned</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <form onSubmit={handleDateRangeFilter} className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="YYYY-MM-DD,YYYY-MM-DD"
                className="rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 px-4 py-3 min-w-[200px] transition-all duration-200"
                value={dateRangeFilter || ""}
                onChange={(e) => setDateRangeFilter(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 p-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </form>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{order.orderNumber}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{order.items?.length || 0} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.userId ? order.userId.name : order.shippingAddress?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.userId ? order.userId.email : order.shippingAddress?.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{order.payment?.mode || "N/A"}</div>
                    {order.payment?.paymentId && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.payment.paymentId.method || "N/A"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      {/* <Link
                        href={`/api/orders/${order._id}/invoice`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        <FileText className="h-5 w-5" />
                      </Link> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * limit, orders.length)}</span> of{" "}
                <span className="font-medium">{totalPages * limit}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page
                  if (totalPages <= 5) {
                    page = i + 1
                  } else if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                        page === currentPage
                          ? "bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
