import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";
import { forgotPasswordEmailContent } from "../emailContent/forgotPassword.emailContent";
import { comparePassword } from "../utils/passwordEncrypt.utils";
import { registeredEmailContent } from "./../emailContent/register.emailContent";
import { User } from "./../model/user.model";
import { createUser } from "./../service/auth.service";
import { AppError } from "./../utils/AppError.utils";
import catchAsync from "./../utils/catchAsync.utils";
import emailHelper from "./../utils/emailHandler.utils";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";
import jwthelper from "./../utils/jwtHelper.utils";

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
    // 1) Check if user exists && password is correct
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user || !(await comparePassword(req.body.password, user.password))) {
      return next(new AppError("Invalid credentials!", 401));
    }

    // Create token
    const token: string = await jwthelper.signToken(
      user._id,
      req.body.rememberme || false
    );

    // User response with token and user data
    return res.status(200).json({
      status: "success",
      token: token,
      data: omit(user.toJSON(), "password"),
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

const verifyEmail: authType = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    verification_token: await encryptedRandomString(req.params.token),
    verification_expire_at: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError(
        `Your verification token is either expired or invalid or you are already verified`,
        400
      )
    );
  }

  user.verification_token = undefined;
  user.verification_expiring_at = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Your email has been verified",
  });
});

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
  verifyEmail,
  forgotPassword,
  resetPassword,
};
