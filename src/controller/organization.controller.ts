import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.utils";
import {
  CreateOrg,
  DeleteOrg,
  FetchAllOrg,
  FetchOrg,
  UpdateOrg,
} from "./../service/organization.service";

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(res.locals.user);
    const organization = await CreateOrg(res.locals.user, req.body);

    res.status(200).json({
      status: "success",
      data: organization,
    });
  }
);

const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organizations = await FetchAllOrg(req.query);

    res.status(200).json({
      status: "success",
      results: organizations.length,
      data: organizations,
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const organization = await FetchOrg(res.locals.user.organization);

    res.status(200).json({
      status: "success",
      data: organization,
    });
  }
);

const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UpdateOrg(res.locals.user.organization, req.body);

    res.status(200).json({
      status: "success",
      message: "Updated!",
    });
  }
);

const destroy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await DeleteOrg(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  }
);

export default {
  store,
  index,
  show,
  update,
  destroy,
};
