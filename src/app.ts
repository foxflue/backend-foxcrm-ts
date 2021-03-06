import express from "express";
// import cron from "node-cron";
// import { DeleteFakeAccount } from "./../src/service/auth.service";
import four04Route from "./common/404.error";
import { globalErrorHandler } from "./common/error.controller";
import { connectDB } from "./db/connect.db";
import authRoute from "./routes/auth.route";
import dashboardRoute from "./routes/dashboard.route";
import fileRoute from "./routes/file.route";
import leadRoute from "./routes/lead.route";
import orgRoute from "./routes/organization.route";
import paymentRoute from "./routes/payment.route";
import postRoute from "./routes/post.route";
import projectRoute from "./routes/project.route";
import userRoute from "./routes/user.route";

const app = express();

// Connect MongoDB
connectDB();

app.use(express.json());

// cron.schedule("01 0 0 * * *", () => {
//   DeleteFakeAccount();
// });

app.use("/api/v2", authRoute);
app.use("/api/v2", userRoute);
app.use("/api/v2", projectRoute);
app.use("/api/v2", postRoute);
app.use("/api/v2", leadRoute);
app.use("/api/v2", fileRoute);
app.use("/api/v2", dashboardRoute);
app.use("/api/v2", paymentRoute);
app.use("/api/v2", orgRoute);

app.use(globalErrorHandler);
app.use(four04Route);

export default app;
