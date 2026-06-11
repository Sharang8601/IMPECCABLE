import { Router } from "express";
import { orderController } from "../controllers/orderController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validations/orderValidation.js";

const router = Router();

router.post("/", protect, validate(createOrderSchema), orderController.create);
router.get("/my", protect, orderController.myOrders);
router.get("/admin", protect, requireAdmin, orderController.listAdmin);
router.patch("/admin/:id/status", protect, requireAdmin, validate(updateOrderStatusSchema), orderController.updateStatus);

export default router;