import dotenv from "dotenv";
import { connectDatabase } from "../config/database.js";
import { Category } from "../models/Category.js";
import { Service } from "../models/Service.js";

dotenv.config();

const clear = async () => {
  await connectDatabase();
  console.log("Cleaning Category and Service collections...");
  await Promise.all([
    Category.deleteMany({}),
    Service.deleteMany({}),
  ]);
  console.log("Collections cleared successfully.");
  process.exit(0);
};

clear().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
