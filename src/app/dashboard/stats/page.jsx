"use client"

import { useEffect, useState } from "react"
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import axios from "axios"
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, MapPin, CreditCard } from "lucide-react"
import LoadingSpinner from "@/components/admin/dashboard/LoadingSpinner"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler)

export default function Stats() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/stats")
        setData(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching stats data:", err)
        setError("Failed to load statistics data")
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <LoadingSpinner size="lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Sales Performance Chart
  const salesData = {
    labels: monthNames,
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthNames.map((_, index) => {
          const monthData = data.salesData.find((d) => d._id === index + 1)
          return monthData ? monthData.totalRevenue : 0
        }),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Orders",
        data: monthNames.map((_, index) => {
          const monthData = data.salesData.find((d) => d._id === index + 1)
          return monthData ? monthData.orderCount : 0
        }),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  }

  // Best-Selling Products Chart
  const bestSellingProductsData = {
    labels: data.productSalesData
      .slice(0, 8)
      .map((p) => (p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name)),
    datasets: [
      {
        label: "Units Sold",
        data: data.productSalesData.slice(0, 8).map((p) => p.sales),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  }

  // Customer Demographics Chart
  const customerDemographicsData = {
    labels: data.customerDemographics.slice(0, 6).map((c) => c._id || "Unknown"),
    datasets: [
      {
        data: data.customerDemographics.slice(0, 6).map((c) => c.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  }

  // User Registration Chart
  const userRegistrationData = {
    labels: monthNames,
    datasets: [
      {
        label: "New Users",
        data: monthNames.map((_, index) => {
          const monthData = data.userRegistrationStats.find((stat) => stat._id === index + 1)
          return monthData ? monthData.userCount : 0
        }),
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  // Payment Method Analytics
  const paymentMethodData = {
    labels: data.paymentMethodAnalytics.map((p) => p._id),
    datasets: [
      {
        data: data.paymentMethodAnalytics.map((p) => p.count),
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(59, 130, 246, 0.8)", "rgba(245, 158, 11, 0.8)"],
        borderWidth: 0,
      },
    ],
  }

  // Category Performance
  const categoryData = {
    labels: data.categoryPerformance.slice(0, 6).map((c) => c._id),
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.categoryPerformance.slice(0, 6).map((c) => c.totalRevenue),
        backgroundColor: "rgba(236, 72, 153, 0.8)",
        borderRadius: 8,
      },
    ],
  }

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
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

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Statistics</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{data.salesData.reduce((sum, month) => sum + month.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.salesData.reduce((sum, month) => sum + month.orderCount, 0).toLocaleString()}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.userRegistrationStats.reduce((sum, month) => sum + month.userCount, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹
                  {data.paymentMethodAnalytics.length > 0
                    ? Math.round(
                        data.paymentMethodAnalytics.reduce((sum, method) => sum + method.avgOrderValue, 0) /
                          data.paymentMethodAnalytics.length,
                      ).toLocaleString()
                    : 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <Line data={salesData} options={lineChartOptions} />
            </div>
          </div>

          {/* Best-Selling Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Best-Selling Products</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <Bar data={bestSellingProductsData} options={barChartOptions} />
            </div>
          </div>

          {/* User Registrations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Registrations</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <Bar data={userRegistrationData} options={barChartOptions} />
            </div>
          </div>

          {/* Customer Demographics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Demographics</h3>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <Pie data={customerDemographicsData} options={pieChartOptions} />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <Doughnut data={paymentMethodData} options={pieChartOptions} />
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <Bar data={categoryData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Detailed Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Top Products by Revenue</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data.productSalesData.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{product.revenue?.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top States Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Top States by Orders</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data.customerDemographics.slice(0, 5).map((state, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{state._id || "Unknown"}</p>
                        <p className="text-sm text-gray-500">{state.count} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{state.revenue?.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
