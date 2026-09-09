import { z } from "zod";

const categoryFields = {
  name: z.string().trim().min(1),
};

export const createCategorySchema = z.object(categoryFields);

export const updateCategorySchema = z
  .object(categoryFields)
  .partial()
  // Reject empty update payloads before they reach the controller.
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const categoryIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid category id"),
});
