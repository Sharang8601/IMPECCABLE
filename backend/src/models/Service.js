import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
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

serviceSchema.index({ category: 1, subCategory: 1, slug: 1 }, { unique: true });

serviceSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  next();
});

export const Service = mongoose.model("Service", serviceSchema);