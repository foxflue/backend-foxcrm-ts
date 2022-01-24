import { DocumentDefinition } from "mongoose";
import { User, UserDocument } from "./../model/user.model";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    const verificationToken = await hashString();
    input.verification_token = await encryptedRandomString(verificationToken);
    input.verification_expiring_at = Date.now() + 10 * 60 * 60 * 1000;

    return { user: await User.create(input), verificationToken };
  } catch (error) {
    throw error;
  }
}
