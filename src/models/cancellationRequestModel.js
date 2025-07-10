import mongoose from "mongoose"

const cancellationRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    orderDetails: {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          price: Number,
          quantity: Number,
        },
      ],
      payment: {
        mode: {
          type: String,
          enum: ["Prepaid", "COD"],
        },
        paymentId: String,
        orderId: String,
      },
      amount: Number,
      shipping: {
        shipmentID: String,
        shippingOrderId: String,
      },
    },
    reason: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "PROCESSING"],
      default: "PENDING",
    },
    customerInfo: {
      name: String,
      email: String,
      contact: String,
    },
    adminNote: {
      type: String,
      default: "",
    },
    refundDetails: {
      refundId: String,
      amount: Number,
      method: String,
      status: {
        type: String,
        enum: ["PENDING", "PROCESSED", "FAILED"],
      },
      processedAt: Date,
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
)

const CancellationRequest =
  mongoose.models.CancellationRequest || mongoose.model("CancellationRequest", cancellationRequestSchema)

export default CancellationRequest
