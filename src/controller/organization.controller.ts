import { NextFunction, Request, Response } from "express";
import { orgRegisteredEmail } from "../emailContent/org.registered.emailContent";
import catchAsync from "../utils/catchAsync.utils";
import {
  CreateOrg,
  DeleteOrg,
  EmailVerification,
  FetchAllOrg,
  FetchOrg,
  UpdateOrg,
} from "./../service/organization.service";
import emailHelper from "./../utils/emailHandler.utils";

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { organization, verificationToken } = await CreateOrg(
      res.locals.user._id,
      req.body
    );

    // Send Greetings Email
    await emailHelper.sendEmail({
      email: organization.email,
      subject: "Welcome to Foxflue",
      body: await orgRegisteredEmail(organization.title, verificationToken),
    });

    res.status(200).json({
      status: "success",
      message: "Please verify your email.",
    });
  }
);

const orgEmailVerify = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await EmailVerification(req.params.token);

    res.status(200).json({
      status: "success",
      message: "Email verified.",
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
    const organization = await FetchOrg(req.params.id);

    res.status(200).json({
      status: "success",
      data: organization,
    });
  }
);

const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UpdateOrg(req.params.id, req.body);

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
  orgEmailVerify,
};
