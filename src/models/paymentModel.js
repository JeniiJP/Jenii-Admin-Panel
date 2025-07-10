import mongoose from "mongoose"

// Payment schema to store detailed payment information
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
  },
  rzr_order_id: {
    type: String,
  },
  rzr_payment_id: {
    type: String,
  },
  signature: {
    type: String,
  },
  method: {
    type: String,
    required: true,
  },
  via: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
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
paymentSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema)

export default Payment
