import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import speakeasy from "speakeasy";
import { AppError } from "../utils/AppError.utils";
import { loginWithGithub } from "../utils/OAuth/github.oauth";
import { comparePassword } from "../utils/passwordEncrypt.utils";
import { User, UserDocument } from "./../model/user.model";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";
import jwtHelper from "./../utils/jwtHelper.utils";
import { loginWithFacebook } from "./../utils/OAuth/facebook.oauth";
import { loginWithGoogle } from "./../utils/OAuth/google.oauth";

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

    if (
      !user ||
      !user.password ||
      !(await comparePassword(password, user.password))
    ) {
      throw new AppError("Invalid credentials!", 401);
    }

    if (user.verification_token || user.verification_expiring_at) {
      throw new AppError(
        "Please verify your email, or resend email verification request.",
        400
      );
    }
    if (user.two_fa.mode && user.two_fa.base32) {
      const secretToken = speakeasy.totp({
        secret: user.two_fa.base32,
        encoding: "base32",
      });

      return {
        user,
        token: undefined,
        secretToken,
      };
    }

    // Create token
    const token = await jwtHelper.signToken({
      id: user.id,
      rememberme: rememberme || false,
    });

    return {
      user: omit(
        user.toJSON(),
        "password",
        "createdAt",
        "updatedAt",
        "__v",
        "two_fa"
      ),
      token,
      secretToken: undefined,
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

export async function ResendEmailForVerify({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  try {
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as UserDocument;

    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError("Invalid credentials!", 401);
    }

    const verificationToken = await hashString();

    user.verification_token = await encryptedRandomString(verificationToken);
    user.verification_expiring_at = Date.now() + 10 * 60 * 60 * 1000;

    await user.save();

    return { user, verificationToken };
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

    if (user.verification_token || user.verification_expiring_at) {
      throw new AppError("Please Verify your email.", 405);
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

export async function DeleteFakeAccount() {
  try {
    return await User.deleteMany({
      verification_token: { $ne: undefined },
      verification_expiring_at: {
        $gt: new Date().getTime() - 1000 * 60 * 60 * 24 * 10,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function UpdatePassword({
  id,
  oldPassword,
  password,
  passwordConfirm,
}: {
  id: string;
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}) {
  try {
    if (password !== passwordConfirm) {
      throw new AppError("Password should be match.", 400);
    }
    const user = await User.findById(id).select("+password");

    if (!user || !(await comparePassword(oldPassword, user.password))) {
      throw new AppError("Invalid Credentials.", 400);
    }
    user.password = password;

    await user.save();

    return;
  } catch (error) {
    throw error;
  }
}

export async function OAuthLogin({
  id,
  code,
  client_id,
  redirect_uri,
}: {
  id: string;
  code: string;
  client_id: string;
  redirect_uri: string;
}) {
  try {
    let user;

    switch (id) {
      case "google":
        user = (await loginWithGoogle(
          code,
          client_id,
          redirect_uri
        )) as UserDocument;
        break;

      case "facebook":
        user = (await loginWithFacebook(
          code,
          client_id,
          redirect_uri
        )) as UserDocument;
        break;

      case "github":
        user = (await loginWithGithub(
          code,
          client_id,
          redirect_uri
        )) as UserDocument;

        break;
    }

    if (!user) {
      throw new AppError("Unable to create account", 406);
    }

    // Generate JWT Token
    const token = await jwtHelper.signToken({ id: user.id, rememberme: true });

    return token;
  } catch (error) {
    throw error;
  }
}

export async function SetTwoFA({ id, mode }: { id: string; mode: boolean }) {
  try {
    let user = (await User.findById(id)) as UserDocument;

    if (mode) {
      user.two_fa.base32 = await speakeasy.generateSecret().base32;
      user.two_fa.mode = true;
    } else {
      user.two_fa.base32 = undefined;
      user.two_fa.mode = false;
    }

    await user.save();

    return;
  } catch (error) {
    throw error;
  }
}

export async function VerifySecret(id: string, otp: string) {
  try {
    const user = await User.findById(id);

    if (!user || !user.two_fa.base32) {
      throw new AppError("Invalid Request.", 406);
    }

    const isValid = speakeasy.totp.verify({
      secret: user.two_fa.base32,
      encoding: "base32",
      token: otp,
      window: 6,
    });

    if (!isValid) {
      throw new AppError("Invalid Input.", 406);
    }

    const token = jwtHelper.signToken({ id: user.id, rememberme: false });

    return {
      user: omit(
        user.toJSON(),
        "password",
        "createdAt",
        "updatedAt",
        "__v",
        "two_fa"
      ),
      token,
    };
  } catch (error) {
    throw error;
  }
}
