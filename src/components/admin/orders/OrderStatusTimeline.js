"use client"

import { useState } from "react"
import { Box, Package, Truck, CheckCircle, XCircle, RotateCcw, AlertTriangle, Clock, RefreshCw } from "lucide-react"
import { formatDate } from "@/utils/productDiscount"
import { updateOrderStatus } from "@/utils/adminUtils"

export default function OrderStatusTimeline({ orderId, status, createdAt, updatedAt, shippingDetails }) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true)
    setError("")

    try {
      await updateOrderStatus(orderId, newStatus)
      setCurrentStatus(newStatus)
    } catch (error) {
      console.error("Error updating order status:", error)
      setError("Failed to update order status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const statusSteps = [
    {
      id: "PENDING",
      label: "Order Placed",
      icon: Box,
      date: formatDate(createdAt),
      description: "Order has been placed and is awaiting confirmation.",
    },
    {
      id: "CONFIRMED",
      label: "Order Confirmed",
      icon: Package,
      date: currentStatus === "PENDING" ? null : formatDate(updatedAt),
      description: "Order has been confirmed and is being prepared for shipping.",
    },
    {
      id: "SHIPPED",
      label: "Order Shipped",
      icon: Truck,
      date: currentStatus === "PENDING" || currentStatus === "CONFIRMED" ? null : formatDate(updatedAt),
      description: `${shippingDetails?.awb ? `AWB: ${shippingDetails.awb}` : "Order has been shipped and is on the way."}`,
    },
    {
      id: "DELIVERED",
      label: "Order Delivered",
      icon: CheckCircle,
      date: currentStatus === "DELIVERED" ? formatDate(updatedAt) : null,
      description: "Order has been delivered successfully.",
    },
  ]

  // Add cancelled status if current status is CANCELLED
  if (currentStatus === "CANCELLED") {
    statusSteps.push({
      id: "CANCELLED",
      label: "Order Cancelled",
      icon: XCircle,
      date: formatDate(updatedAt),
      description: "Order has been cancelled.",
    })
  }

  // Add returned status if current status is RETURNED
  if (currentStatus === "RETURNED") {
    statusSteps.push({
      id: "RETURNED",
      label: "Order Returned",
      icon: RotateCcw,
      date: formatDate(updatedAt),
      description: "Order has been returned.",
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Timeline</h2>

        {error && (
          <div className="text-sm text-red-500 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        <div className="flex space-x-2">
          {currentStatus !== "CANCELLED" && currentStatus !== "DELIVERED" && (
            <button
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={isUpdating}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {isUpdating ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
              Cancel Order
            </button>
          )}

          {currentStatus === "PENDING" && (
            <button
              onClick={() => handleStatusUpdate("CONFIRMED")}
              disabled={isUpdating}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {isUpdating ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Package className="h-4 w-4 mr-1" />}
              Confirm Order
            </button>
          )}

          {currentStatus === "CONFIRMED" && (
            <button
              onClick={() => handleStatusUpdate("SHIPPED")}
              disabled={isUpdating}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {isUpdating ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Truck className="h-4 w-4 mr-1" />}
              Mark as Shipped
            </button>
          )}

          {currentStatus === "SHIPPED" && (
            <button
              onClick={() => handleStatusUpdate("DELIVERED")}
              disabled={isUpdating}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-1" />
              )}
              Mark as Delivered
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {/* Timeline steps */}
          <div className="space-y-8">
            {statusSteps.map((step, index) => {
              const isActive =
                (currentStatus === "PENDING" && step.id === "PENDING") ||
                (currentStatus === "CONFIRMED" && ["PENDING", "CONFIRMED"].includes(step.id)) ||
                (currentStatus === "SHIPPED" && ["PENDING", "CONFIRMED", "SHIPPED"].includes(step.id)) ||
                (currentStatus === "DELIVERED" && ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].includes(step.id)) ||
                (currentStatus === "CANCELLED" && step.id === "CANCELLED") ||
                (currentStatus === "RETURNED" && step.id === "RETURNED")

              return (
                <div key={step.id} className="relative flex items-start">
                  <div
                    className={`absolute left-5 -ml-3 h-6 w-6 rounded-full border-2  ${
                      isActive
                        ? "bg-primary-500 border-primary-500 bg-pink-700"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    } flex items-center justify-center z-10`}
                  >
                    <step.icon className={`h-3 w-3 ${isActive ? "text-white " : "text-gray-400 "}`} />
                  </div>

                  <div className="ml-10">
                    <h3
                      className={`text-lg font-medium ${
                        isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h3>

                    {step.date && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {step.date}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{step.description}</p>

                    {step.id === "SHIPPED" && shippingDetails?.trackingUrl && (
                      <a
                        href={shippingDetails.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Track Shipment
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
