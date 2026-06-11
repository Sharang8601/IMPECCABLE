import { z } from "zod";
import { objectIdSchema } from "./commonSchemas.js";

export const replaceCartSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          serviceId: objectIdSchema,
          quantity: z.coerce.number().int().min(1).max(20).default(1),
        }),
      )
      .default([]),
  }),
});

export const cartItemSchema = z.object({
  body: z.object({
    serviceId: objectIdSchema,
    quantity: z.coerce.number().int().min(1).max(20).default(1),
  }),
});