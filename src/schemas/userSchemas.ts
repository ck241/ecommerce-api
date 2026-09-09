import { z } from "zod";

const userFields = {
  name: z.string().trim().min(1),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
};

export const createUserSchema = z.object(userFields);

export const updateUserSchema = z
  .object(userFields)
  .partial()
  // Reject empty update payloads before they reach the controller.
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const userIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user id"),
});
