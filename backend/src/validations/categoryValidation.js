import { z } from "zod";
import { idParamSchema } from "./commonSchemas.js";

const categoryBody = z.object({
  name: z.string().trim().min(2).max(80),
  gender: z.enum(["Male", "Female"]),
  displayOrder: z.coerce.number().int().min(0).optional().default(0),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  isActive: z.preprocess(
    (val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return undefined;
    },
    z.boolean().optional().default(true),
  ),
});

export const createCategorySchema = z.object({ body: categoryBody });

export const updateCategorySchema = idParamSchema.extend({
  body: categoryBody.partial(),
});