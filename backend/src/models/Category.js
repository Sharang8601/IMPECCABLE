import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

categorySchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

export const Category = mongoose.model("Category", categorySchema);