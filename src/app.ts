import * as dotenv from "dotenv";
import express from "express";

dotenv.config({ path: __dirname + "./../.env" });

const app = express();

const PORT = 1227;
const HOST = process.env.HOST as string;

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
