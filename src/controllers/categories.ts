import type { RequestHandler } from "express";
import { Category } from "../models/index.ts";
import { shapeDocument } from "../utils/index.ts";

/**
 * Returns all categories.
 *
 * @param _request The incoming Express request.
 * @param response The Express response used to return the categories.
 * @returns A promise fulfilled after the response is sent.
 */
export const getCategories: RequestHandler = async (_request, response) => {
  const categories = await Category.find();
  response
    .status(200)
    .json(categories.map((category) => shapeDocument(category)));
};

/**
 * Creates a category.
 *
 * @param request The Express request containing validated category data.
 * @param response The Express response used to return the created category.
 * @returns A promise fulfilled after the response is sent.
 */
export const createCategory: RequestHandler = async (request, response) => {
  const category = await Category.create(request.body);
  response.status(201).json(shapeDocument(category));
};

/**
 * Returns a single category by ID.
 *
 * @param request The Express request containing a validated category ID.
 * @param response The Express response used to return the category or a not-found error.
 * @returns A promise fulfilled after the response is sent.
 */
export const getCategoryById: RequestHandler = async (request, response) => {
  const category = await Category.findById(request.params.id);

  if (!category) {
    response.status(404).json({ error: { message: "Category not found" } });
    return;
  }

  response.status(200).json(shapeDocument(category));
};

/**
 * Updates an existing category.
 *
 * @param request The Express request containing a category ID and validated update data.
 * @param response The Express response used to return the category or a not-found error.
 * @returns A promise fulfilled after the response is sent.
 */
export const updateCategory: RequestHandler = async (request, response) => {
  const category = await Category.findByIdAndUpdate(
    request.params.id,
    request.body,
    { returnDocument: "after", runValidators: true },
  );

  if (!category) {
    response.status(404).json({ error: { message: "Category not found" } });
    return;
  }

  response.status(200).json(shapeDocument(category));
};

/**
 * Deletes a category by ID.
 *
 * @param request The Express request containing a validated category ID.
 * @param response The Express response used to return a no-content or not-found response.
 * @returns A promise fulfilled after the response is sent.
 */
export const deleteCategory: RequestHandler = async (request, response) => {
  const category = await Category.findByIdAndDelete(request.params.id);

  if (!category) {
    response.status(404).json({ error: { message: "Category not found" } });
    return;
  }

  response.status(204).send();
};
