import mongoose from "mongoose"

// Order Item schema for detailed tracking of individual items
const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field on save
orderItemSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

const OrderItem = mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema)

export default OrderItem
