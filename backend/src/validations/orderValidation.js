import { z } from "zod";
import { idParamSchema, objectIdSchema } from "./commonSchemas.js";

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          serviceId: objectIdSchema,
          quantity: z.coerce.number().int().min(1).max(20).default(1),
        }),
      )
      .min(1),
    notes: z.string().trim().max(1000).optional().default(""),
  }),
});

export const updateOrderStatusSchema = idParamSchema.extend({
  body: z.object({
    status: z.enum(["Pending", "Contacted", "Completed", "Cancelled"]),
  }),
});