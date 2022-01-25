import { omit } from "lodash";
import { DocumentDefinition } from "mongoose";
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
        "You need to verify your email, otherwise you won't get permit to login.",
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

// export async function UserEmailVerification(token: string) {
//   try {
//     const user = await User.findOne({
//       verification_token: await encryptedRandomString(token),
//       verification_expire_at: { $gt: Date.now() },
//     });

//     if (!user) {
//       return new AppError(
//         "Your verification token is either expired or invalid or you are already verified.",
//         400
//       );
//     }

//     user.verification_token = undefined;
//     user.verification_expiring_at = undefined;

//     await user.save();

//     return true;
//   } catch (error) {
//     throw error;
//   }
// }
