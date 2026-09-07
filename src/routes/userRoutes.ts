import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/index.ts";
import { validateRequest } from "../middleware/validateRequest.ts";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamsSchema,
} from "../schemas/index.ts";

export const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", validateRequest({ body: createUserSchema }), createUser);
userRouter.get(
  "/:id",
  validateRequest({ params: userIdParamsSchema }),
  getUserById,
);
userRouter.put(
  "/:id",
  validateRequest({ params: userIdParamsSchema, body: updateUserSchema }),
  updateUser,
);
userRouter.delete(
  "/:id",
  validateRequest({ params: userIdParamsSchema }),
  deleteUser,
);
