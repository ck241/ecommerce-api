import type { RequestHandler } from "express";
import { User } from "../models/index.ts";
import { shapeDocument } from "../utils/index.ts";

/**
 * Returns all users without their passwords.
 *
 * @param _request The incoming Express request.
 * @param response The Express response used to return the users.
 * @returns A promise fulfilled after the response is sent.
 */
export const getUsers: RequestHandler = async (_request, response) => {
  const users = await User.find().select("-password");
  response.status(200).json(users.map((user) => shapeDocument(user)));
};

/**
 * Creates a user and excludes the password from the response.
 *
 * @param request The Express request containing validated user data.
 * @param response The Express response used to return the created user.
 * @returns A promise fulfilled after the response is sent.
 */
export const createUser: RequestHandler = async (request, response) => {
  const user = await User.create(request.body);
  response.status(201).json(shapeDocument(user, ["password"]));
};

/**
 * Returns a single user by ID without its password.
 *
 * @param request The Express request containing a validated user ID.
 * @param response The Express response used to return the user or a not-found error.
 * @returns A promise fulfilled after the response is sent.
 */
export const getUserById: RequestHandler = async (request, response) => {
  const user = await User.findById(request.params.id).select("-password");

  if (!user) {
    response.status(404).json({ error: { message: "User not found" } });
    return;
  }

  response.status(200).json(shapeDocument(user));
};

/**
 * Updates an existing user and excludes the password from the response.
 *
 * @param request The Express request containing a user ID and validated update data.
 * @param response The Express response used to return the user or a not-found error.
 * @returns A promise fulfilled after the response is sent.
 */
export const updateUser: RequestHandler = async (request, response) => {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    response.status(404).json({ error: { message: "User not found" } });
    return;
  }

  response.status(200).json(shapeDocument(user, ["password"]));
};

/**
 * Deletes a user by ID.
 *
 * @param request The Express request containing a validated user ID.
 * @param response The Express response used to return a success or not-found response.
 * @returns A promise fulfilled after the response is sent.
 */
export const deleteUser: RequestHandler = async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id);

  if (!user) {
    response.status(404).json({ error: { message: "User not found" } });
    return;
  }

  response.status(200).json({ message: "User deleted successfully" });
};
