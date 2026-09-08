import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid product id");

const productFields = {
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().nonnegative(),
  categoryId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid category id"),
};

export const createProductSchema = z.object(productFields);

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const productIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const productQuerySchema = z.object({
  categoryId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid category id")
    .optional(),
});