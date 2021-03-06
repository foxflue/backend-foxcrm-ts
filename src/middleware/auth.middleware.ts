import { NextFunction, Request, Response } from "express";
import { User, UserDocument } from "./../model/user.model";
import catchAsync from "./../utils/catchAsync.utils";
import jwtHelper from "./../utils/jwtHelper.utils";

// Login required middleware
const checkLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = jwtHelper.extractToken(req) as string;

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized request 💀",
      });
    }

    const decoded = jwtHelper.verifyToken(token);
    const userId: string = Object(decoded).id;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized Request",
      });
    }

    const user = (await User.findById(userId)) as UserDocument;

    if (user.verification_token) {
      return res.status(401).json({
        status: "fail",
        message: "Please verify your email",
      });
    }

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized Request",
      });
    }

    res.locals.user = user;

    next();
  }
);

const checkSuperAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user.roles;
    if (!user.includes("superadmin")) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized Request",
      });
    }

    next();
  }
);

const checkAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user.roles;
    if (!user.includes("admin")) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized Request",
      });
    }

    next();
  }
);

const checkManager = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user.roles;
    if (!user.includes("manager")) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized Request",
      });
    }

    next();
  }
);

const checkEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user.roles;
    if (!user.includes("employee")) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized Request",
      });
    }

    next();
  }
);

export default {
  checkLogin,
  checkSuperAdmin,
  checkAdmin,
  checkManager,
  checkEmployee,
};
