import { DocumentDefinition } from "mongoose";
import {
  Organization,
  OrganizationDocument,
} from "../model/organization.model";
import { UserDocument } from "../model/user.model";
import APIFeatures from "../utils/apiFeture.utils";
import { AppError } from "../utils/AppError.utils";

export async function CreateOrg(
  user: UserDocument,
  input: DocumentDefinition<OrganizationDocument>
) {
  try {
    input.email = user.email;
    input.phone = user.phone;
    input.admin = user._id;

    const organization = await Organization.create(input);

    user.organization = organization._id;
    await user.save();

    return organization;
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
