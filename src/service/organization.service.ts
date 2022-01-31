import { DocumentDefinition } from "mongoose";
import {
  Organization,
  OrganizationDocument,
} from "../model/organization.model";
import { UserDocument } from "../model/user.model";
import APIFeatures from "../utils/apiFeture.utils";
import { AppError } from "../utils/AppError.utils";
import { encryptedRandomString, hashString } from "./../utils/hashString.utils";

export async function CreateOrg(
  id: UserDocument["_id"],
  input: DocumentDefinition<OrganizationDocument>
) {
  try {
    const verificationToken = await hashString();
    input.verification_token = await encryptedRandomString(verificationToken);
    input.verification_expiring_at = Date.now() + 10 * 60 * 60 * 1000;
    input.admin = id;

    const organization = await Organization.create(input);

    return { organization, verificationToken };
  } catch (error) {
    throw error;
  }
}

export async function EmailVerification(token: string) {
  try {
    const organization = await Organization.findOne({
      verification_token: await encryptedRandomString(token),
      verification_expiring_at: { $gt: Date.now() },
    });

    if (!organization) {
      throw new AppError(
        "Your verification token is either expired or invalid or you are already verified.",
        400
      );
    }

    organization.verification_token = undefined;
    organization.verification_expiring_at = undefined;

    await organization.save();

    return;
  } catch (error) {
    throw error;
  }
}

export async function FetchAllOrg(query: object) {
  try {
    const features = new APIFeatures(Organization.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await features.query;
  } catch (error) {
    throw error;
  }
}

export async function FetchOrg(id: OrganizationDocument["_id"]) {
  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      throw new AppError("Not found", 404);
    }

    return organization;
  } catch (error) {
    throw error;
  }
}

export async function UpdateOrg(
  id: OrganizationDocument["_id"],
  input: DocumentDefinition<OrganizationDocument>
) {
  try {
    const organization = await Organization.findByIdAndUpdate(id, input);

    if (!organization) {
      throw new AppError("Not found", 404);
    }

    return;
  } catch (error) {
    throw error;
  }
}

export async function DeleteOrg(id: OrganizationDocument["_id"]) {
  try {
    const organization = await Organization.findByIdAndDelete(id);

    if (!organization) {
      throw new AppError("Not found", 404);
    }

    return;
  } catch (error) {
    throw error;
  }
}
