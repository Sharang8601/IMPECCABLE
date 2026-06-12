import { z } from "zod";
import { idParamSchema, objectIdSchema } from "./commonSchemas.js";

const serviceBody = z.object({
  name: z.string().trim().min(2).max(140).optional(),
  title: z.string().trim().min(2).max(140).optional(),
  description: z.string().trim().min(5).max(800),
  price: z.coerce.number().nonnegative(),
  mrp: z.coerce.number().nonnegative().optional(),
  duration: z.string().trim().min(2).max(40),
  imageUrl: z.string().optional().or(z.literal("")),
  categoryId: objectIdSchema.optional(),
  category: objectIdSchema.optional(),
  gender: z.enum(["Male", "Female"]),
  isActive: z.preprocess(
    (val) => {
      if (val === "true" || val === true) return true;
      if (val === "false" || val === false) return false;
      return undefined;
    },
    z.boolean().optional().default(true),
  ),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export const createServiceSchema = z.object({ body: serviceBody });
export const updateServiceSchema = idParamSchema.extend({ body: serviceBody.partial() });

export const serviceQuerySchema = z.object({
  query: z.object({
    category: z.string().trim().optional(),
    categoryId: z.string().trim().optional(),
    gender: z.string().trim().optional(),
    active: z.coerce.boolean().optional(),
  }),
});