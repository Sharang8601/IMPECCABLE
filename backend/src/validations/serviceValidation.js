import { z } from "zod";
import { idParamSchema, objectIdSchema } from "./commonSchemas.js";

const serviceBody = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(5).max(800),
  price: z.coerce.number().nonnegative(),
  duration: z.string().trim().min(2).max(40),
  imageUrl: z.string().url().optional().or(z.literal("")),
  category: objectIdSchema,
  subCategory: objectIdSchema,
  isActive: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const createServiceSchema = z.object({ body: serviceBody });
export const updateServiceSchema = idParamSchema.extend({ body: serviceBody.partial() });

export const serviceQuerySchema = z.object({
  query: z.object({
    category: z.string().trim().optional(),
    subCategory: z.string().trim().optional(),
    active: z.coerce.boolean().optional(),
  }),
});