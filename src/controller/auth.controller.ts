import { NextFunction, Request, Response } from "express";
import { forgotPasswordEmailContent } from "../emailContent/forgotPassword.emailContent";
import { registeredEmailContent } from "./../emailContent/register.emailContent";
import {
  createUser,
  LoginUser,
  OAuthLogin,
  ResendEmailForVerify,
  UpdatePassword,
  UserEmailVerification,
  UserForgotPassword,
  UserResetPassword,
} from "./../service/auth.service";
import catchAsync from "./../utils/catchAsync.utils";
import emailHelper from "./../utils/emailHandler.utils";

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
const resendVerifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, verificationToken } = await ResendEmailForVerify(req.body);

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

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UpdatePassword({
      id: res.locals.user._id,
      oldPassword: req.body.oldPassword,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    res.status(200).json({
      status: "success",
      message: "Password has been updated",
    });
  }
);

const socialLogin = catchAsync(async (req, res, next) => {
  const access_token = await OAuthLogin({
    id: req.params.id,
    code: req.body.code,
    client_id: req.body.client_id,
    redirect_uri: req.body.redirect_uri,
  });

  res.status(200).json(access_token);
});

export default {
  login,
  register,
  me,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerifyEmail,
  changePassword,
  socialLogin,
};
