import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import catchAsync from "../utils/catchAsync.utils";

export const validate = (schema: AnySchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  });
};
