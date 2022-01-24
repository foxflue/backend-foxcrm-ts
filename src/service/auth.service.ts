import { omit } from "lodash";
import { DocumentDefinition } from "mongoose";
import { comparePassword } from "../utils/passwordEncrypt.utils";
import { User, UserDocument } from "./../model/user.model";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    const verificationToken = await hashString();
    input.verification_token = await encryptedRandomString(verificationToken);
    input.verification_expiring_at = Date.now() + 10 * 60 * 60 * 1000;

    const user = await User.create(input);

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
}: {
  email: UserDocument["email"];
  password: string;
}) {
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await comparePassword(password, user.password))) {
      return false;
    }

    return omit(user.toJSON(), "password", "createdAt", "updatedAt", "__v");
  } catch (error) {
    throw error;
  }
}
