import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import { AppError } from "../utils/AppError.utils";
import { comparePassword } from "../utils/passwordEncrypt.utils";
import { User, UserDocument } from "./../model/user.model";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";
import jwtHelper from "./../utils/jwtHelper.utils";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    const verificationToken = await hashString();
    input.verification_token = await encryptedRandomString(verificationToken);
    input.verification_expiring_at = Date.now() + 10 * 60 * 60 * 1000;

    const user = await User.create(input);

    if (!user) {
      throw new AppError("Something goes wrong, try again.", 500);
    }

    return {
      user: omit(user.toJSON(), "password", "createdAt", "updatedAt", "__v"),
      verificationToken,
    };
  } catch (error) {
    throw error;
  }
}

export async function LoginUser({
  email,
  password,
  rememberme,
}: {
  email: UserDocument["email"];
  password: string;
  rememberme: boolean | null;
}) {
  try {
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as UserDocument;

    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError("Invalid credentials!", 401);
    }

    if (user.verification_token || user.verification_expiring_at) {
      throw new AppError(
        "Please verify your email, or resend email verification request.",
        400
      );
    }

    // Create token
    const token = await jwtHelper.signToken(user.id, rememberme || false);

    return {
      user: omit(user.toJSON(), "password", "createdAt", "updatedAt", "__v"),
      token,
    };
  } catch (error) {
    throw error;
  }
}

export async function UserEmailVerification(token: string) {
  try {
    const user = await User.findOne({
      verification_token: await encryptedRandomString(token),
      verification_expiring_at: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(
        "Your verification token is either expired or invalid or you are already verified.",
        400
      );
    }

    user.verification_token = undefined;
    user.verification_expiring_at = undefined;

    await user.save();

    return;
  } catch (error) {
    throw error;
  }
}

export async function UserForgotPassword(query: FilterQuery<UserDocument>) {
  try {
    const user = (await User.findOne(query)) as UserDocument;

    if (!user) {
      throw new AppError(`The user is not registered with us`, 404);
    }

    const verificationToken = await hashString();

    user.reset_token = await encryptedRandomString(verificationToken);
    user.reset_expiring_at = Date.now() + 20 * 60 * 1000; // 20 Minutes

    await user.save();

    return { user, verificationToken };
  } catch (error) {
    throw error;
  }
}

export async function UserResetPassword({
  token,
  password,
  passwordConfirm,
}: {
  token: string;
  password: string;
  passwordConfirm: string;
}) {
  try {
    if (password !== passwordConfirm) {
      throw new AppError("Password dosen't match", 400);
    }

    const user = await User.findOne({
      reset_token: await encryptedRandomString(token),
      reset_expiring_at: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new AppError(
        `The verification code is either wrong or expired. Please try again`,
        403
      );
    }

    user.reset_token = undefined;
    user.reset_expiring_at = undefined;
    user.password = password;

    await user.save();

    return;
  } catch (error) {
    throw error;
  }
}
