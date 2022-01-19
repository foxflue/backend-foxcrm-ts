import * as dotenv from "dotenv";
import express from "express";
import four04Route from "./common/404.error";
import { globalErrorHandler } from "./common/error.controller";

dotenv.config({ path: __dirname + "./../.env" });

const app = express();

const PORT = 1227;
const HOST = process.env.HOST as string;

app.use(four04Route);
app.use(globalErrorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
