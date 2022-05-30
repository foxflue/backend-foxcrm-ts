import mongoose from "mongoose";

// const MONGO_URI = Object(process.env).MONGODB_URL as string;

// console.log(MONGO_URI);

// Connect MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("MongoDB connected");
  } catch (e : any) {
    console.log(e);
    process.exit(1);
  }
};
