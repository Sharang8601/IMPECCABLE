import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== "production",
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
};