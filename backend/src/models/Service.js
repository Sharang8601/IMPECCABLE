import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 140,
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 800,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    mrp: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// We index by categoryId, gender, and slug
serviceSchema.index({ categoryId: 1, gender: 1, slug: 1 }, { unique: true });

serviceSchema.pre("validate", function setCompatibilityFields(next) {
  if (!this.title && this.name) {
    this.title = this.name;
  }
  if (!this.name && this.title) {
    this.name = this.title;
  }
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  if (!this.category && this.categoryId) {
    this.category = this.categoryId;
  }
  if (!this.categoryId && this.category) {
    this.categoryId = this.category;
  }
  next();
});

export const Service = mongoose.model("Service", serviceSchema);