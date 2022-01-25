import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import { AppError } from "../utils/AppError.utils";
import { comparePassword } from "../utils/passwordEncrypt.utils";
import { User, UserDocument } from "./../model/user.model";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";
import jwtHelper from "./../utils/jwtHelper.utils";
import {
  loginWithFacebook,
  loginWithGithub,
  loginWithGoogle,
  upsertUser,
} from "./../utils/oAuth.utils";

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
        const googleUser = await loginWithGoogle(code, client_id, redirect_uri);
        console.log(googleUser);
        if (!googleUser.email_verified) {
          throw new AppError(
            "Unable to create account: Unverified google account",
            406
          );
        }
        user = (await upsertUser(
          googleUser.sub,
          googleUser.email,
          googleUser.name
        )) as UserDocument;
        break;

      case "facebook":
        const facebookUser = await loginWithFacebook(
          code,
          client_id,
          redirect_uri
        );
        console.log(facebookUser);
        if (!facebookUser.email && !facebookUser.id) {
          throw new AppError(
            "Unable to create account: Facebook account does not have email",
            400
          );
        }
        user = (await upsertUser(
          facebookUser.id,
          facebookUser.email,
          facebookUser.name
        )) as UserDocument;
        break;

      case "github":
        const githubUser = await loginWithGithub(code, client_id, redirect_uri);
        console.log(githubUser);
        if (!githubUser.email) {
          throw new AppError(
            "Unable to create account: Unverified amazon account",
            406
          );
        }
        user = (await upsertUser(
          githubUser.id,
          githubUser.email,
          githubUser.name
        )) as UserDocument;
        break;
    }

    if (!user) {
      throw new AppError("Unable to create account", 406);
    }

    // Generate JWT Token
    const token = await jwtHelper.signToken(user._id, true);

    return token;
  } catch (error) {
    throw error;
  }
}
