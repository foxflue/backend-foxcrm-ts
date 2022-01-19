import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import four04Route from "./common/404.error";
import { globalErrorHandler } from "./common/error.controller";
import authRouth from "./routes/auth.route";

dotenv.config();

const app = express();

const PORT = 1227;
const HOST = process.env.HOST as string;
const MONGO_URI = process.env.MONGODB_URL as string;

// Connect MongoDB
try {
  (async () => {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  })();
} catch (e) {
  console.log(e);
  process.exit(1);
}

app.use(express.json());

app.use("/api/v2", authRouth);
app.use(four04Route);
app.use(globalErrorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
