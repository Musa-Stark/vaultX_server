import mongoose from "mongoose";
import { envs } from "./env.js";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("⚡ Already connected to DB");
    return;
  }

  if (mongoose.connection.readyState === 2) {
    console.log("⏳ Connection in progress...");
    return;
  }

  try {
    await mongoose.connect(envs.MONGODB_URI);
    console.log("✅ Connected to DB!");
  } catch (error) {
    console.log("❌ Error while connecting to DB!");
    console.log(error.message);
  }
};
