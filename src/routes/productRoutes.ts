import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/index.ts";
import { validateRequest } from "../middleware/validateRequest.ts";
import {
  createProductSchema,
  productIdParamsSchema,
  productQuerySchema,
  updateProductSchema,
} from "../schemas/index.ts";

export const productRouter = Router();

productRouter.get(
  "/",
  validateRequest({ query: productQuerySchema }),
  getProducts,
);
productRouter.post(
  "/",
  validateRequest({ body: createProductSchema }),
  createProduct,
);
productRouter.get(
  "/:id",
  validateRequest({ params: productIdParamsSchema }),
  getProductById,
);
productRouter.put(
  "/:id",
  validateRequest({ params: productIdParamsSchema, body: updateProductSchema }),
  updateProduct,
);
productRouter.delete(
  "/:id",
  validateRequest({ params: productIdParamsSchema }),
  deleteProduct,
);
