import { NextFunction, Request, RequestHandler, Response } from "express";

type func = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Error | any>;

type Catch = (fn: func) => RequestHandler;

const catchAsync: Catch = (fn) => (req, res, next) =>
  fn(req, res, next).catch(next);

export default catchAsync;
