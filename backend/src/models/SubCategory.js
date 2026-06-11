import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

subCategorySchema.index({ category: 1, slug: 1 }, { unique: true });

subCategorySchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }
  next();
});

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);