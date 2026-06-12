import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Category } from "../models/Category.js";
import { Service } from "../models/Service.js";
import { seedCategories, seedServices } from "./seedData.js";
import { slugify } from "./slugify.js";

dotenv.config();

const seed = async () => {
  await connectDatabase();

  console.log("Cleaning database...");
  await Promise.all([
    Category.deleteMany({}),
    Service.deleteMany({}),
  ]);

  try {
    await mongoose.connection.db.dropCollection("subcategories");
    console.log("Cleared deprecated subcategories collection.");
  } catch (err) {
    // If the collection doesn't exist, ignore the error
  }

  console.log("Inserting categories...");
  const categoryDocs = await Category.insertMany(
    seedCategories.map((category) => ({
      ...category,
      slug: slugify(`${category.name}-${category.gender}`),
    })),
  );

  // Map categoryName + gender to Category document
  const categoryMap = new Map(
    categoryDocs.map((cat) => [`${cat.name}:${cat.gender}`, cat]),
  );

  console.log("Inserting services...");
  await Service.insertMany(
    seedServices.map((service, index) => {
      const categoryDoc = categoryMap.get(`${service.categoryName}:${service.gender}`);
      if (!categoryDoc) {
        throw new Error(`Category mapping failed for: ${service.categoryName}:${service.gender}`);
      }

      return {
        name: service.name,
        title: service.name,
        slug: slugify(service.name),
        description: service.description,
        price: service.price,
        mrp: service.mrp || Math.ceil(service.price * 1.25),
        duration: service.duration,
        categoryId: categoryDoc._id,
        category: categoryDoc._id,
        gender: service.gender,
        image: { url: service.image, publicId: "" },
        isActive: service.isActive ?? true,
        sortOrder: index,
      };
    }),
  );

  console.log("Seed completed: categories and services populated.");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});