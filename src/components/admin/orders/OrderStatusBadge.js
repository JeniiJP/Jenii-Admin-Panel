export default function OrderStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-800 dark:text-amber-300",
          border: "border-amber-200 dark:border-amber-700",
          icon: "⏳",
        }
      case "CONFIRMED":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-800 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-700",
          icon: "✅",
        }
      case "SHIPPED":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-800 dark:text-purple-300",
          border: "border-purple-200 dark:border-purple-700",
          icon: "🚚",
        }
      case "DELIVERED":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-800 dark:text-green-300",
          border: "border-green-200 dark:border-green-700",
          icon: "📦",
        }
      case "CANCELLED":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-800 dark:text-red-300",
          border: "border-red-200 dark:border-red-700",
          icon: "❌",
        }
      case "RETURNED":
        return {
          bg: "bg-gray-100 dark:bg-gray-700/50",
          text: "text-gray-800 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-600",
          icon: "↩️",
        }
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-700/50",
          text: "text-gray-800 dark:text-gray-300",
          border: "border-gray-200 dark:border-gray-600",
          icon: "❓",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} transition-all duration-200 hover:scale-105`}
    >
      <span className="text-xs">{config.icon}</span>
      {status}
    </span>
  )
}
