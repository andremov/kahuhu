// connect to mongo backend database using mongoose
import mongoose from "mongoose";
import { getConfigValue } from "../utils/config";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(getConfigValue("mongoURI"));
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
