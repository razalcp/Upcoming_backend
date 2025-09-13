import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/upcoming");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
