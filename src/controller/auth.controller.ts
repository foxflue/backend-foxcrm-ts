import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";
import { User, UserDocument } from "./../model/user.model";
import { AppError } from "./../utils/AppError.utils";
import catchAsync from "./../utils/catchAsync.utils";
import emailHelper from "./../utils/emailHandler.utils";
import jwthelper from "./../utils/jwtHelper.utils";
import emailTemplate from "./../view/email/template";

interface RegisterCredential {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}
interface LoginData {
  email: string;
  password: string;
  rememberme: boolean;
}
interface resetData {
  password: string;
  passwordConfirm: string;
}

type authType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | object;

const login: authType = catchAsync(async (req, res, next) => {
  const { email, password, rememberme }: LoginData = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = (await User.findOne({ email }).select(
    "+password"
  )) as UserDocument;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials!", 401));
  }

  // Create token
  const token: string = await jwthelper.signToken(
    user._id,
    rememberme || false
  );

  // User response with token and user data
  return res.status(200).json({
    status: "success",
    token: token,
    data: omit(user.toJSON(), "password"),
  });
});

const register: authType = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, passwordConfirm }: RegisterCredential =
    req.body;

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 12);

  // Verification Token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const encryptedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.create({
    name,
    email,
    phone,
    password: passwordHash,
    verification_token: encryptedVerificationToken,
    verification_expire_at: Date.now() + 10 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: "success",
    data: user,
  });

  let emailContent = emailTemplate.replace("{{name}}", user.name);
  emailContent = emailContent.replace(
    "{{body}}",
    "Your Foxflue CRM account has been created. Now nothing can stop you from taking your business online"
  );
  emailContent = emailContent.replace(
    "{{link}}",
    `${Object(process.env).FRONTEND}/auth/verify-email/${verificationToken}`
  );
  emailContent = emailContent.replace("{{btnLabel}}", "Verify your email");
  emailContent = emailContent.replace(
    "{{footerText}}",
    "if you didn't create the account then ignore this email."
  );

  // Send Greetings Email
  await emailHelper.sendEmail({
    email: user.email,
    subject: "Welcome to Foxflue",
    body: emailContent,
  });
});

const me: authType = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: res.locals.user,
  });
});

const logout: authType = catchAsync(async (req, res, next) => {
  res.status(200).json({
    message: "User has been logged out from the application",
  });
});

const verifyEmail: authType = catchAsync(async (req, res, next) => {
  const token = req.params.token as string;

  const encryptedVerificationToken: string = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = (await User.findOne({
    verification_token: encryptedVerificationToken,
    verification_expire_at: { $gt: Date.now() },
  })) as UserDocument;

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

const forgotPassword: authType = catchAsync(async (req, res, next) => {
  const email = req.body.email as string;

  const user = (await User.findOne({ email })) as UserDocument;

  if (!user) {
    return next(new AppError(`The user is not registered with us`, 404));
  }

  const verificationToken: string = crypto.randomBytes(32).toString("hex");

  const encryptedVerificationToken: string = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  user.reset_token = encryptedVerificationToken;
  user.reset_expiring_at = Date.now() + 20 * 60 * 1000; // 20 Minutes

  await user.save();

  res.status(200).json({
    status: "success",
    message: "A verification email has been sent to the registered email",
  });

  let emailContent = emailTemplate.replace("{{name}}", user.name);
  emailContent = emailContent.replace(
    "{{body}}",
    "You have requested to reset your password. Please click on the link below to reset your password"
  );
  emailContent = emailContent.replace(
    "{{link}}",
    `${process.env.FRONTEND}/auth/reset-password/${verificationToken}`
  );
  emailContent = emailContent.replace("{{btnLabel}}", "Reset Password");
  emailContent = emailContent.replace(
    "{{footerText}}",
    "if you didn't request to reset your password then ignore this email."
  );

  // Send Verification Email
  await emailHelper.sendEmail({
    email: user.email,
    subject: "Reset Password",
    body: emailContent,
  });
});

const resetPassword: authType = catchAsync(async (req, res, next) => {
  const token = req.params.token as string;
  const { password, passwordConfirm } = req.body as resetData;

  if (password !== passwordConfirm) {
    return next(new AppError("Password dosen't match", 400));
  }

  const encryptedToken: string = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = (await User.findOne({
    reset_token: encryptedToken,
    reset_expire_at: {
      $gt: Date.now(),
    },
  })) as UserDocument;

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

  // Hash the password
  const passwordHash: string = await bcrypt.hash(password, 12);
  user.password = passwordHash;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been updated",
  });
});

export default {
  login,
  register,
  me,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
