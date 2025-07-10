import { formatDate, formatCurrency } from "./productDiscount"

// Helper function to convert array of objects to CSV
function convertToCSV(objArray) {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray
  let str = ""

  // Add headers
  const headers = Object.keys(array[0])
  str += headers.join(",") + "\r\n"

  // Add rows
  for (let i = 0; i < array.length; i++) {
    let line = ""
    for (const index in headers) {
      const key = headers[index]
      if (line !== "") line += ","
      // Handle values with commas by wrapping in quotes
      let value = array[i][key]
      if (value === null || value === undefined) {
        value = ""
      } else if (typeof value === "string" && value.includes(",")) {
        value = `"${value}"`
      }
      line += value
    }
    str += line + "\r\n"
  }
  return str
}

// Export orders to CSV file
export async function exportOrdersToCSV(orders) {
  // Format orders data for CSV
  const formattedOrders = orders.map((order) => {
    return {
      OrderNumber: order.orderNumber,
      Date: formatDate(order.createdAt),
      CustomerName: order.userId ? order.userId.name : order.shippingAddress.name,
      CustomerEmail: order.userId ? order.userId.email : order.shippingAddress.email,
      Status: order.orderStatus,
      PaymentMode: order.payment.mode,
      ItemsCount: order.items.length,
      Subtotal: formatCurrency(order.subtotal).replace(/[₹,]/g, ""),
      ShippingCost: formatCurrency(order.shippingCost).replace(/[₹,]/g, ""),
      Discount: formatCurrency(order.discount).replace(/[₹,]/g, ""),
      TotalAmount: formatCurrency(order.totalAmount).replace(/[₹,]/g, ""),
      ShippingAddress: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.pincode}`,
      TrackingNumber: order.shipping?.awb || "N/A",
    }
  })

  // Convert to CSV
  const csv = convertToCSV(formattedOrders)

  // Create a blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
