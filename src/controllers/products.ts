import type { RequestHandler } from "express";
import { Category, Product } from "../models/index.ts";
import { shapeDocument } from "../utils/index.ts";

async function categoryExists(categoryId: string): Promise<boolean> {
  return (await Category.exists({ _id: categoryId })) !== null;
}

export const getProducts: RequestHandler = async (request, response) => {
  const categoryId = request.query.categoryId;
  const filter = typeof categoryId === "string" ? { categoryId } : {};
  const products = await Product.find(filter);
  response.status(200).json(products.map((product) => shapeDocument(product)));
};

export const createProduct: RequestHandler = async (request, response) => {
  if (!(await categoryExists(request.body.categoryId))) {
    response.status(400).json({ error: { message: "Category not found" } });
    return;
  }

  const product = await Product.create(request.body);
  response.status(201).json(shapeDocument(product));
};

export const getProductById: RequestHandler = async (request, response) => {
  const product = await Product.findById(request.params.id);

  if (!product) {
    response.status(404).json({ error: { message: "Product not found" } });
    return;
  }

  response.status(200).json(shapeDocument(product));
};

export const updateProduct: RequestHandler = async (request, response) => {
  if (
    request.body.categoryId &&
    !(await categoryExists(request.body.categoryId))
  ) {
    response.status(400).json({ error: { message: "Category not found" } });
    return;
  }

  const product = await Product.findByIdAndUpdate(
    request.params.id,
    request.body,
    { returnDocument: "after", runValidators: true },
  );

  if (!product) {
    response.status(404).json({ error: { message: "Product not found" } });
    return;
  }

  response.status(200).json(shapeDocument(product));
};

export const deleteProduct: RequestHandler = async (request, response) => {
  const product = await Product.findByIdAndDelete(request.params.id);

  if (!product) {
    response.status(404).json({ error: { message: "Product not found" } });
    return;
  }

  response.status(204).send();
};
