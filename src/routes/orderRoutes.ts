import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controllers/index.ts";
import { validateRequest } from "../middleware/validateRequest.ts";
import {
  createOrderSchema,
  orderIdParamsSchema,
  updateOrderSchema,
} from "../schemas/index.ts";

export const orderRouter = Router();

orderRouter.get("/", getOrders);
orderRouter.post(
  "/",
  validateRequest({ body: createOrderSchema }),
  createOrder,
);
orderRouter.get(
  "/:id",
  validateRequest({ params: orderIdParamsSchema }),
  getOrderById,
);
orderRouter.put(
  "/:id",
  validateRequest({ params: orderIdParamsSchema, body: updateOrderSchema }),
  updateOrder,
);
orderRouter.delete(
  "/:id",
  validateRequest({ params: orderIdParamsSchema }),
  deleteOrder,
);
