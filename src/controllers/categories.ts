import type { RequestHandler } from "express";
import { Category } from "../models/index.ts";

function shapeCategory(
  category: InstanceType<typeof Category>,
): Record<string, unknown> {
  const { _id, ...categoryData } = category.toObject();
  return { id: _id.toString(), ...categoryData };
}

export const getCategories: RequestHandler = async (_request, response) => {
  const categories = await Category.find();
  response.status(200).json(categories.map(shapeCategory));
};

export const createCategory: RequestHandler = async (request, response) => {
  const category = await Category.create(request.body);
  response.status(201).json(shapeCategory(category));
};

export const getCategoryById: RequestHandler = async (request, response) => {
  const category = await Category.findById(request.params.id);

  if (!category) {
    response.status(404).json({ error: { message: "Category not found" } });
    return;
  }

  response.status(200).json(shapeCategory(category));
};

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

  response.status(200).json(shapeCategory(category));
};

export const deleteCategory: RequestHandler = async (request, response) => {
  const category = await Category.findByIdAndDelete(request.params.id);

  if (!category) {
    response.status(404).json({ error: { message: "Category not found" } });
    return;
  }

  response.status(204).send();
};
