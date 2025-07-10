"use client"

const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    orange: "border-orange-500",
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  )
}

export default LoadingSpinner
