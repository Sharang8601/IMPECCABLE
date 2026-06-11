import { Router } from "express";
import { adminController } from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(protect, requireAdmin);
router.get("/dashboard", adminController.dashboard);
router.get("/customers", adminController.customers);

export default router;