import { NextFunction, Request, Response } from "express";
import { forgotPasswordEmailContent } from "../emailContent/forgotPassword.emailContent";
import { registeredEmailContent } from "./../emailContent/register.emailContent";
import { User } from "./../model/user.model";
import { createUser, LoginUser } from "./../service/auth.service";
import { AppError } from "./../utils/AppError.utils";
import catchAsync from "./../utils/catchAsync.utils";
import emailHelper from "./../utils/emailHandler.utils";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";

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

// const verifyEmail: authType = catchAsync(async (req, res, next) => {
//   await UserEmailVerification(req.params.token);

//   res.status(200).json({
//     status: "success",
//     message: "Your email has been verified",
//   });
// });

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError(`The user is not registered with us`, 404));
    }

    const verificationToken = await hashString();

    user.reset_token = await encryptedRandomString(verificationToken);
    user.reset_expiring_at = Date.now() + 20 * 60 * 1000; // 20 Minutes

    await user.save();

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
    const { password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return next(new AppError("Password dosen't match", 400));
    }

    const user = await User.findOne({
      reset_token: await encryptedRandomString(req.params.token),
      reset_expire_at: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(
        new AppError(
          `The verification code is either wrong or expired. Please try again`,
          403
        )
      );
    }

    user.reset_token = undefined;
    user.reset_expiring_at = undefined;
    user.password = password;

    await user.save();

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
  // verifyEmail,
  forgotPassword,
  resetPassword,
};
