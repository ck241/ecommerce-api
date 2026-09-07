import type { RequestHandler } from "express";
import { User } from "../models/index.ts";

function shapeUser(user: InstanceType<typeof User>): Record<string, unknown> {
  const { _id, password, ...userData } = user.toObject();
  return { id: _id.toString(), ...userData };
}

export const getUsers: RequestHandler = async (_request, response) => {
  const users = await User.find().select("-password");
  response.status(200).json(users.map(shapeUser));
};

export const createUser: RequestHandler = async (request, response) => {
  const user = await User.create(request.body);
  response.status(201).json(shapeUser(user));
};

export const getUserById: RequestHandler = async (request, response) => {
  const user = await User.findById(request.params.id).select("-password");

  if (!user) {
    response.status(404).json({ error: { message: "User not found" } });
    return;
  }

  response.status(200).json(shapeUser(user));
};

export const updateUser: RequestHandler = async (request, response) => {
  const user = await User.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    response.status(404).json({ error: { message: "User not found" } });
    return;
  }

  response.status(200).json(shapeUser(user));
};

export const deleteUser: RequestHandler = async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id);

  if (!user) {
    response.status(404).json({ error: { message: "User not found" } });
    return;
  }

  response.status(204).send();
};
