import mongoose from "mongoose";

// const MONGO_URI = Object(process.env).MONGODB_URL as string;

// console.log(MONGO_URI);

// Connect MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/foxcrm-new");
    console.log("MongoDB connected");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
