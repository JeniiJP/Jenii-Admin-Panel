// Function to update order status
export async function updateOrderStatus(orderId, status) {
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update order status")
    }
  
    return await response.json()
  }
  
  // Function to generate invoice PDF
  export async function generateInvoicePDF(orderId) {
    const response = await fetch(`/api/orders/${orderId}/invoice`, {
      method: "GET",
    })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to generate invoice")
    }
  
    return response.blob()
  }
  
  // Function to handle Shiprocket webhook verification
  export async function verifyShiprocketWebhook(signature, payload) {
    // This is a placeholder for the actual verification logic
    // You would typically verify the signature using a shared secret
    return true
  }
  