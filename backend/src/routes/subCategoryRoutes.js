import { Router } from "express";
import { subCategoryController } from "../controllers/subCategoryController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validations/commonSchemas.js";
import { createSubCategorySchema, updateSubCategorySchema } from "../validations/subCategoryValidation.js";

const router = Router();

router.get("/", subCategoryController.listPublic);
router.get("/admin", protect, requireAdmin, subCategoryController.listAdmin);
router.post("/", protect, requireAdmin, validate(createSubCategorySchema), subCategoryController.create);
router.patch("/:id", protect, requireAdmin, validate(updateSubCategorySchema), subCategoryController.update);
router.delete("/:id", protect, requireAdmin, validate(idParamSchema), subCategoryController.remove);

export default router;