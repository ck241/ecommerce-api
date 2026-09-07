import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
}
