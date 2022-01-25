import { NextFunction, Request, Response } from "express";
import { forgotPasswordEmailContent } from "../emailContent/forgotPassword.emailContent";
import { registeredEmailContent } from "./../emailContent/register.emailContent";
import {
  createUser,
  LoginUser,
  UserEmailVerification,
  UserForgotPassword,
  UserResetPassword,
} from "./../service/auth.service";
import catchAsync from "./../utils/catchAsync.utils";
import emailHelper from "./../utils/emailHandler.utils";

interface resetData {
  password: string;
  passwordConfirm: string;
}

type authType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | object;

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = await LoginUser({
      email: req.body.email,
      password: req.body.password,
      rememberme: req.body.rememberme,
    });

    // User response with token and user data
    res.status(200).json({
      status: "success",
      token: token,
      data: user,
    });
  }
);

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // User Create
    const { user, verificationToken } = await createUser(req.body);

    // Response
    res.status(201).json({
      status: "success",
      data: user,
    });

    // Send Greetings Email
    await emailHelper.sendEmail({
      email: user.email,
      subject: "Welcome to Foxflue",
      body: await registeredEmailContent(user.name, verificationToken),
    });
  }
);

const me = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      data: res.locals.user,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "User has been logged out from the application",
    });
  }
);

const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UserEmailVerification(req.params.token);

    res.status(200).json({
      status: "success",
      message: "Your email has been verified",
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, verificationToken } = await UserForgotPassword({
      email: req.body.email,
    });

    res.status(200).json({
      status: "success",
      message: "A verification email has been sent to the registered email",
    });

    // Send Verification Email
    await emailHelper.sendEmail({
      email: user.email,
      subject: "Reset Password",
      body: await forgotPasswordEmailContent(user.name, verificationToken),
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UserResetPassword({
      token: req.params.token,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(200).json({
      status: "success",
      message: "Password has been updated",
    });
  }
);

export default {
  login,
  register,
  me,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
