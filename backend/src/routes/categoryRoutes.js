import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validations/commonSchemas.js";
import { createCategorySchema, updateCategorySchema } from "../validations/categoryValidation.js";

const router = Router();

router.get("/", categoryController.listPublic);
router.get("/admin", protect, requireAdmin, categoryController.listAdmin);
router.post("/", protect, requireAdmin, upload.single("image"), validate(createCategorySchema), categoryController.create);
router.put("/:id", protect, requireAdmin, upload.single("image"), validate(updateCategorySchema), categoryController.update);
router.patch("/:id", protect, requireAdmin, upload.single("image"), validate(updateCategorySchema), categoryController.update);
router.delete("/:id", protect, requireAdmin, validate(idParamSchema), categoryController.remove);

export default router;