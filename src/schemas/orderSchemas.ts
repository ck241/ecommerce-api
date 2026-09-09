import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

const orderItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().positive(),
});

const orderFields = {
  userId: objectIdSchema,
  products: z.array(orderItemSchema).min(1),
};

export const createOrderSchema = z.object(orderFields);

export const updateOrderSchema = z
  .object(orderFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const orderIdParamsSchema = z.object({
  id: objectIdSchema,
});
