import { z } from "zod";
import { idParamSchema, objectIdSchema } from "./commonSchemas.js";

const subCategoryBody = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional().default(""),
  category: objectIdSchema,
  isActive: z.boolean().optional(),
});

export const createSubCategorySchema = z.object({ body: subCategoryBody });

export const updateSubCategorySchema = idParamSchema.extend({
  body: subCategoryBody.partial(),
});