import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);