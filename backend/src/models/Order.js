import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    title: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, max: 20 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerAvatar: { type: String, default: "" },
    services: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, "Order must include at least one service"],
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },
    notes: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);