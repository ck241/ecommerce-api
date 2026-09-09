import type { RequestHandler } from "express";
import { Order, Product, User } from "../models/index.ts";
import { shapeDocument } from "../utils/index.ts";

type OrderItem = {
  productId: string;
  quantity: number;
};

/**
 * Calculates an order total from the current prices of all referenced products.
 *
 * @param products The product IDs and quantities in the order.
 * @returns A promise resolving to the calculated total, or `null` when a product is missing.
 */
async function calculateTotal(products: OrderItem[]): Promise<number | null> {
  const productIds = [...new Set(products.map((product) => product.productId))];
  const databaseProducts = await Product.find({ _id: { $in: productIds } });

  if (databaseProducts.length !== productIds.length) {
    return null;
  }

  // Use a lookup map so duplicate order items are included at the current price.
  const pricesByProductId = new Map(
    databaseProducts.map((product) => [product._id.toString(), product.price]),
  );

  return products.reduce(
    (total, product) =>
      total +
      (pricesByProductId.get(product.productId) ?? 0) * product.quantity,
    0,
  );
}

/**
 * Returns all orders.
 *
 * @param _request The incoming Express request.
 * @param response The Express response used to return the orders.
 * @returns A promise fulfilled after the response is sent.
 */
export const getOrders: RequestHandler = async (_request, response) => {
  const orders = await Order.find();
  response.status(200).json(orders.map((order) => shapeDocument(order)));
};

/**
 * Creates an order after validating its user, products, and calculated total.
 *
 * @param request The Express request containing validated order data.
 * @param response The Express response used to return the order or a validation error.
 * @returns A promise fulfilled after the response is sent.
 */
export const createOrder: RequestHandler = async (request, response) => {
  const { userId, products } = request.body as {
    userId: string;
    products: OrderItem[];
  };

  if (!(await User.exists({ _id: userId }))) {
    response.status(400).json({ error: { message: "User not found" } });
    return;
  }

  const total = await calculateTotal(products);

  if (total === null) {
    response.status(400).json({ error: { message: "Product not found" } });
    return;
  }

  const order = await Order.create({ userId, products, total });
  response.status(201).json(shapeDocument(order));
};

/**
 * Returns a single order by ID.
 *
 * @param request The Express request containing a validated order ID.
 * @param response The Express response used to return the order or a not-found error.
 * @returns A promise fulfilled after the response is sent.
 */
export const getOrderById: RequestHandler = async (request, response) => {
  const order = await Order.findById(request.params.id);

  if (!order) {
    response.status(404).json({ error: { message: "Order not found" } });
    return;
  }

  response.status(200).json(shapeDocument(order));
};

/**
 * Updates an order using current product prices to recalculate its total.
 *
 * @param request The Express request containing an order ID and validated update data.
 * @param response The Express response used to return the order or an error.
 * @returns A promise fulfilled after the response is sent.
 */
export const updateOrder: RequestHandler = async (request, response) => {
  const order = await Order.findById(request.params.id);

  if (!order) {
    response.status(404).json({ error: { message: "Order not found" } });
    return;
  }

  // Merge the patch with persisted values before validating references and total.
  const userId =
    (request.body.userId as string | undefined) ?? order.userId.toString();
  const products =
    (request.body.products as OrderItem[] | undefined) ??
    order.products.map((product) => ({
      productId: product.productId.toString(),
      quantity: product.quantity,
    }));

  if (!(await User.exists({ _id: userId }))) {
    response.status(400).json({ error: { message: "User not found" } });
    return;
  }

  const total = await calculateTotal(products);

  if (total === null) {
    response.status(400).json({ error: { message: "Product not found" } });
    return;
  }

  order.set({ userId, products, total });
  await order.save();
  response.status(200).json(shapeDocument(order));
};

/**
 * Deletes an order by ID.
 *
 * @param request The Express request containing a validated order ID.
 * @param response The Express response used to return a no-content or not-found response.
 * @returns A promise fulfilled after the response is sent.
 */
export const deleteOrder: RequestHandler = async (request, response) => {
  const order = await Order.findByIdAndDelete(request.params.id);

  if (!order) {
    response.status(404).json({ error: { message: "Order not found" } });
    return;
  }

  response.status(204).send();
};
