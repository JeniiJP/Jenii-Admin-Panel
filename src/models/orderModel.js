import mongoose from "mongoose"

// Order schema with references to OrderItems
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderItem",
  }],
  payment: {
    mode: {
      type: String,
      enum: ["Prepaid", "COD"],
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      // This will be null for COD orders
    },
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "PENDING",
    enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED","CANCEL REQUESTED","CANCELLED", "REFUNDED"],
  },
  shippingAddress: {
    name: {
      type: String,
      required: true,
    },
    lastname:{
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    addressline2: {
      type: String,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  billingAddress: {
    name: String,
    lastname: String,
    contact: String,
    address: String,
    addressline2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  shipping: {
    shipmentID: {
      type: String,
    },
    shippingOrderId: {
      type: String,
    },
    awb: {
      type: String,
    },
    trackingUrl: {
      type: String,
    },
    courier: {
      id: String,
      name: String,
      etd: Number,
      rate: Number,
    },
    deliveryOption: {
      type: String,
      enum: ["standard", "express"],
      default: "standard",
    },
    estimatedDelivery: Date,
  },
  coupon: {
    code: String,
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
    },
    discountValue: Number,
    discountAmount: Number,
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
orderSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)

export default Order
