import dotenv from "dotenv";
import { connectDatabase } from "../config/database.js";
import { Category } from "../models/Category.js";
import { Service } from "../models/Service.js";
import { SubCategory } from "../models/SubCategory.js";
import { seedCategories, seedServices, seedSubCategories } from "./seedData.js";
import { slugify } from "./slugify.js";

dotenv.config();

const seed = async () => {
  await connectDatabase();

  await Promise.all([Category.deleteMany({}), SubCategory.deleteMany({}), Service.deleteMany({})]);

  const categoryDocs = await Category.insertMany(
    seedCategories.map((category) => ({ ...category, slug: slugify(category.name) })),
  );

  const categoryMap = new Map(categoryDocs.map((category) => [category.name, category]));
  const subCategoryDocs = [];

  for (const [categoryName, subCategories] of Object.entries(seedSubCategories)) {
    for (const name of subCategories) {
      subCategoryDocs.push({
        name,
        slug: slugify(name),
        category: categoryMap.get(categoryName)._id,
        description: `${name} services for ${categoryName.toLowerCase()}.`,
      });
    }
  }

  const insertedSubCategories = await SubCategory.insertMany(subCategoryDocs);
  const subCategoryMap = new Map(
    insertedSubCategories.map((subCategory) => [
      `${categoryDocs.find((category) => category._id.equals(subCategory.category)).name}:${subCategory.name}`,
      subCategory,
    ]),
  );

  await Service.insertMany(
    seedServices.map((service, index) => ({
      title: service.title,
      slug: slugify(service.title),
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: categoryMap.get(service.category)._id,
      subCategory: subCategoryMap.get(`${service.category}:${service.subCategory}`)._id,
      image: { url: service.image, publicId: "" },
      isActive: true,
      sortOrder: index,
    })),
  );

  console.log("Seed completed: categories, subcategories, and services inserted.");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});