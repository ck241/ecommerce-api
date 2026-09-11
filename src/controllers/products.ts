import type { RequestHandler } from "express";
import { Category, Product } from "../models/index.ts";
import { shapeDocument } from "../utils/index.ts";

/**
 * Checks whether a category exists before associating it with a product.
 *
 * @param categoryId The category ID to look up.
 * @returns A promise resolving to `true` when the category exists.
 */
async function categoryExists(categoryId: string): Promise<boolean> {
  return (await Category.exists({ _id: categoryId })) !== null;
}

/**
 * Returns all products, optionally filtered by category ID.
 *
 * @param request The Express request that can contain a validated category ID query.
 * @param response The Express response used to return the products.
 * @returns A promise fulfilled after the response is sent.
 */
export const getProducts: RequestHandler = async (request, response) => {
  const categoryId = request.query.categoryId;
  const filter = typeof categoryId === "string" ? { categoryId } : {};
  const products = await Product.find(filter);
  response.status(200).json(products.map((product) => shapeDocument(product)));
};

/**
 * Creates a product only when its category exists.
 *
 * @param request The Express request containing validated product data.
 * @param response The Express response used to return the product or a validation error.
 * @returns A promise fulfilled after the response is sent.
 */
export const createProduct: RequestHandler = async (request, response) => {
  if (!(await categoryExists(request.body.categoryId))) {
    response.status(400).json({ error: { message: "Category not found" } });
    return;
  }

  const product = await Product.create(request.body);
  response.status(201).json(shapeDocument(product));
};

/**
 * Returns a single product by ID.
 *
 * @param request The Express request containing a validated product ID.
 * @param response The Express response used to return the product or a not-found error.
 * @returns A promise fulfilled after the response is sent.
 */
export const getProductById: RequestHandler = async (request, response) => {
  const product = await Product.findById(request.params.id);

  if (!product) {
    response.status(404).json({ error: { message: "Product not found" } });
    return;
  }

  response.status(200).json(shapeDocument(product));
};

/**
 * Updates a product and validates a replacement category when provided.
 *
 * @param request The Express request containing a product ID and validated update data.
 * @param response The Express response used to return the product or an error.
 * @returns A promise fulfilled after the response is sent.
 */
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

/**
 * Deletes a product by ID.
 *
 * @param request The Express request containing a validated product ID.
 * @param response The Express response used to return a success or not-found response.
 * @returns A promise fulfilled after the response is sent.
 */
export const deleteProduct: RequestHandler = async (request, response) => {
  const product = await Product.findByIdAndDelete(request.params.id);

  if (!product) {
    response.status(404).json({ error: { message: "Product not found" } });
    return;
  }

  response.status(200).json({ message: "Product deleted successfully" });
};
