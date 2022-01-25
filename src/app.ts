import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import { DeleteFakeAccount } from "./../src/service/auth.service";
import four04Route from "./common/404.error";
import { globalErrorHandler } from "./common/error.controller";
import authRoute from "./routes/auth.route";
import dashboardRoute from "./routes/dashboard.route";
import fileRoute from "./routes/file.route";
import leadRoute from "./routes/lead.route";
import paymentRoute from "./routes/payment.route";
import postRoute from "./routes/post.route";
import projectRoute from "./routes/project.route";
import userRoute from "./routes/user.route";

dotenv.config();

const app = express();

const PORT = Object(process.env).PORT as number;
const HOST = Object(process.env).HOST as string;
const MONGO_URI = Object(process.env).MONGODB_URL as string;

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

cron.schedule("01 0 0 * * *", () => {
  DeleteFakeAccount();
});

app.use("/api/v2", authRoute);
app.use("/api/v2", userRoute);
app.use("/api/v2", projectRoute);
app.use("/api/v2", postRoute);
app.use("/api/v2", leadRoute);
app.use("/api/v2", fileRoute);
app.use("/api/v2", dashboardRoute);
app.use("/api/v2", paymentRoute);

app.use(globalErrorHandler);
app.use(four04Route);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
