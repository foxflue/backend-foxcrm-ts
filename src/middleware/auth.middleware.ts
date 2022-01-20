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

const checkAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(res.locals.user);
    if (res.locals.user.role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized Request",
      });
    }

    next();
  }
);

export default { checkLogin, checkAdmin };
