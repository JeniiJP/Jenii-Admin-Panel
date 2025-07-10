"use client"

import { useState, useEffect } from "react"

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue", isLoading = false }) => {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    if (!isLoading && value) {
      const duration = 1000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setAnimatedValue(value)
          clearInterval(timer)
        } else {
          setAnimatedValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [value, isLoading])

  const colorClasses = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    green: "bg-green-500 text-green-600 bg-green-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    orange: "bg-orange-500 text-orange-600 bg-orange-50",
    red: "bg-red-500 text-red-600 bg-red-50",
    indigo: "bg-indigo-500 text-indigo-600 bg-indigo-50",
  }

  const [bgColor, textColor, cardBg] = colorClasses[color].split(" ")

  if (isLoading) {
    return (
      <div className={`${cardBg} rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse`}>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${cardBg} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {typeof animatedValue === "number" && animatedValue > 1000
              ? `₹${(animatedValue / 1000).toFixed(1)}k`
              : typeof animatedValue === "number"
                ? animatedValue.toLocaleString()
                : animatedValue}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  trend === "up"
                    ? "bg-green-100 text-green-800"
                    : trend === "down"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
