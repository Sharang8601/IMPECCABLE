import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      max: 20,
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Cart = mongoose.model("Cart", cartSchema);