"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import Link from "next/link"
import { ShoppingBag, DollarSign, Package, TrendingUp, Eye, Edit, Calendar } from "lucide-react"
import StatsCard from "@/components/admin/dashboard/StatsCard"
import LoadingSpinner from "@/components/admin/dashboard/LoadingSpinner"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/dashboard")
        setDashboardData(response.data)
        setError(null)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const ordersByMonthData = dashboardData
    ? {
        labels: monthNames,
        datasets: [
          {
            label: "Orders",
            data: monthNames.map((_, index) => {
              const monthData = dashboardData.ordersByMonth.find((item) => item._id === index + 1)
              return monthData ? monthData.count : 0
            }),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: "Revenue (₹)",
            data: monthNames.map((_, index) => {
              const monthData = dashboardData.ordersByMonth.find((item) => item._id === index + 1)
              return monthData ? monthData.revenue / 1000 : 0 // Convert to thousands
            }),
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      }
    : null

  const paymentModesData = dashboardData
    ? {
        labels: dashboardData.paymentModes.map((mode) => mode._id),
        datasets: [
          {
            data: dashboardData.paymentModes.map((mode) => mode.count),
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
            borderWidth: 0,
          },
        ],
      }
    : null

  const orderStatusData = dashboardData
    ? {
        labels: dashboardData.orderStatusDistribution.map((status) => status._id),
        datasets: [
          {
            data: dashboardData.orderStatusDistribution.map((status) => status.count),
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(168, 85, 247, 0.8)",
            ],
            borderWidth: 0,
          },
        ],
      }
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={dashboardData?.totalRevenue}
            icon={DollarSign}
            trend={dashboardData?.revenueGrowth > 0 ? "up" : dashboardData?.revenueGrowth < 0 ? "down" : "neutral"}
            trendValue={Math.abs(dashboardData?.revenueGrowth)}
            color="green"
            isLoading={isLoading}
          />
          <StatsCard
            title="Total Orders"
            value={dashboardData?.totalOrders}
            icon={ShoppingBag}
            trend={dashboardData?.orderGrowth > 0 ? "up" : dashboardData?.orderGrowth < 0 ? "down" : "neutral"}
            trendValue={Math.abs(dashboardData?.orderGrowth)}
            color="blue"
            isLoading={isLoading}
          />
          <StatsCard
            title="Total Products"
            value={dashboardData?.totalProducts}
            icon={Package}
            color="purple"
            isLoading={isLoading}
          />
          <StatsCard
            title="This Month"
            value={dashboardData?.currentMonthOrders}
            icon={Calendar}
            color="orange"
            isLoading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders & Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Orders & Revenue Trend</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="h-80">
                <Bar data={ordersByMonthData} options={chartOptions} />
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="h-80">
                <Doughnut
                  data={paymentModesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Status & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="h-64">
                <Doughnut
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                          font: { size: 11 },
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.topProducts?.slice(0, 5).map((product, index) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {/* <img
                          src={product.image || "/placeholder.svg?height=48&width=48"}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        /> */}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-xs">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.totalQuantity} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {/* <p className="font-semibold text-gray-900">₹{product.totalRevenue?.toLocaleString()}</p> */}
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/admin/orders">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                  Manage Orders
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData?.recentOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.userId?.name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{order.userId?.email || "N/A"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.orderStatus === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : order.orderStatus === "PROCESSING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.orderStatus === "CANCELLED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/orders/${order._id}`}>
                          <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
