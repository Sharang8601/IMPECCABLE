import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { cartItemSchema, replaceCartSchema } from "../validations/cartValidation.js";

const router = Router();

router.use(protect);
router.get("/", cartController.get);
router.put("/", validate(replaceCartSchema), cartController.replace);
router.post("/items", validate(cartItemSchema), cartController.add);
router.delete("/items/:serviceId", cartController.remove);
router.delete("/", cartController.clear);

export default router;