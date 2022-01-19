import express from "express";
import catchAsync from "../utils/catch.async";

const four04Route = express.Router();

four04Route.all(
  "*",
  catchAsync(async (req, res) => {
    res.status(404).json({
      status: 404,
      message: "Route Not Found",
    });
  })
);

export default four04Route;
