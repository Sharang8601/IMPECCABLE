import { Router } from "express";
import { serviceController } from "../controllers/serviceController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validations/commonSchemas.js";
import { createServiceSchema, updateServiceSchema } from "../validations/serviceValidation.js";

const router = Router();

router.get("/", serviceController.listPublic);
router.get("/admin", protect, requireAdmin, serviceController.listAdmin);
router.post("/", protect, requireAdmin, upload.single("image"), validate(createServiceSchema), serviceController.create);
router.patch("/:id", protect, requireAdmin, upload.single("image"), validate(updateServiceSchema), serviceController.update);
router.patch("/:id/toggle", protect, requireAdmin, validate(idParamSchema), serviceController.toggle);
router.delete("/:id", protect, requireAdmin, validate(idParamSchema), serviceController.remove);

export default router;