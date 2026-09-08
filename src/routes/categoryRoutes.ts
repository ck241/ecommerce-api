import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/index.ts";
import { validateRequest } from "../middleware/validateRequest.ts";
import {
  categoryIdParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/index.ts";

export const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.post(
  "/",
  validateRequest({ body: createCategorySchema }),
  createCategory,
);
categoryRouter.get(
  "/:id",
  validateRequest({ params: categoryIdParamsSchema }),
  getCategoryById,
);
categoryRouter.put(
  "/:id",
  validateRequest({
    params: categoryIdParamsSchema,
    body: updateCategorySchema,
  }),
  updateCategory,
);
categoryRouter.delete(
  "/:id",
  validateRequest({ params: categoryIdParamsSchema }),
  deleteCategory,
);
