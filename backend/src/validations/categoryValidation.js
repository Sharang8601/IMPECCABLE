import { z } from "zod";
import { idParamSchema } from "./commonSchemas.js";

const categoryBody = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().default(""),
  isActive: z.boolean().optional(),
});

export const createCategorySchema = z.object({ body: categoryBody });

export const updateCategorySchema = idParamSchema.extend({
  body: categoryBody.partial(),
});