import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const idParamSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(50).optional(),
  }),
});