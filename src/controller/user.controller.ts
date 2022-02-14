import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";
import { createUser } from "../service/auth.service";
import {
  Dashboard,
  FetchAll,
  FetchOne,
  RemoveOne,
} from "../service/user.service";
import catchAsync from "./../utils/catchAsync.utils";

const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await FetchAll(res.locals.user.organization, req.query);
    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  }
);

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.organization = res.locals.user.organization;
    await createUser(req.body);
    res.status(201).json({
      status: "success",
      message: "User has been added",
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await FetchOne(res.locals.user.organization, req.params.id);
    res.status(200).json({
      status: "success",
      data: omit(user.toJSON(), "password"),
    });
  }
);

const destroy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await RemoveOne(req.params.id);

    res.status(204).json({
      status: "success",
      data: "Removed.",
    });
  }
);

const dashboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projects, payments } = await Dashboard(res.locals.user._id);

    res.status(200).json({
      status: "success",
      data: {
        projects,
        payments,
      },
    });
  }
);

export default {
  index,
  store,
  show,
  destroy,
  dashboard,
};
