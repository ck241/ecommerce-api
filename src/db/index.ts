import mongoose from "mongoose";

/**
 * Connects Mongoose to the MongoDB instance configured in the environment.
 *
 * @returns A promise that resolves when the database connection is established.
 * @throws When `MONGODB_URI` is missing or Mongoose cannot connect.
 */
export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}
