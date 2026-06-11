import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import subCategoryRoutes from "./subCategoryRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/subcategories", subCategoryRoutes);
router.use("/services", serviceRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/admin", adminRoutes);

export default router;