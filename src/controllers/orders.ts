import type { RequestHandler } from "express";
import { Order, Product, User } from "../models/index.ts";

type OrderItem = {
  productId: string;
  quantity: number;
};

function shapeOrder(
  order: InstanceType<typeof Order>,
): Record<string, unknown> {
  const { _id, ...orderData } = order.toObject();
  return { id: _id.toString(), ...orderData };
}

async function calculateTotal(products: OrderItem[]): Promise<number | null> {
  const productIds = [...new Set(products.map((product) => product.productId))];
  const databaseProducts = await Product.find({ _id: { $in: productIds } });

  if (databaseProducts.length !== productIds.length) {
    return null;
  }

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

export const getOrders: RequestHandler = async (_request, response) => {
  const orders = await Order.find();
  response.status(200).json(orders.map(shapeOrder));
};

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
  response.status(201).json(shapeOrder(order));
};

export const getOrderById: RequestHandler = async (request, response) => {
  const order = await Order.findById(request.params.id);

  if (!order) {
    response.status(404).json({ error: { message: "Order not found" } });
    return;
  }

  response.status(200).json(shapeOrder(order));
};

export const updateOrder: RequestHandler = async (request, response) => {
  const order = await Order.findById(request.params.id);

  if (!order) {
    response.status(404).json({ error: { message: "Order not found" } });
    return;
  }

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
  response.status(200).json(shapeOrder(order));
};

export const deleteOrder: RequestHandler = async (request, response) => {
  const order = await Order.findByIdAndDelete(request.params.id);

  if (!order) {
    response.status(404).json({ error: { message: "Order not found" } });
    return;
  }

  response.status(204).send();
};
