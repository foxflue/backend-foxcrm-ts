import { DocumentDefinition } from "mongoose";
import { OrganizationDocument } from "../model/organization.model";
import { Project, ProjectDocument } from "../model/project.model";
import { UserDocument } from "../model/user.model";
import APIFeatures from "../utils/apiFeture.utils";
import { AppError } from "../utils/AppError.utils";

export async function CreateProject(
  user: UserDocument,
  input: DocumentDefinition<ProjectDocument>
) {
  try {
    input.due_amount = input.price;
    input.customer = user._id;
    input.organization = user.organization;
    return await Project.create(input);
  } catch (error) {
    throw error;
  }
}

export async function FetchAllProject(
  organization: OrganizationDocument["_id"],
  query: object
) {
  try {
    const features = new APIFeatures(
      Project.find({ organization }).populate("customer"),
      query
    )
      .filter()
      .limitFields()
      .sort()
      .paginate();

    return await features.query;
  } catch (error) {
    throw error;
  }
}

export async function FetchProject(
  organization: OrganizationDocument["_id"],
  id: string
) {
  try {
    const project = await Project.findOne({
      _id: id,
      organization,
    }).populate("customer payments");

    if (!project) {
      throw new AppError("No project found with that ID", 404);
    }
    return project;
  } catch (error) {
    throw error;
  }
}

export async function UpdateProject(
  organization: OrganizationDocument["_id"],
  id: string,
  input: DocumentDefinition<ProjectDocument>
) {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: id, organization },
      input,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      throw new AppError("No project found with that ID", 404);
    }

    return project;
  } catch (error) {
    throw error;
  }
}

export async function DeleteProject(
  organization: OrganizationDocument["_id"],
  id: string
) {
  try {
    const project = await Project.findOneAndDelete({
      _id: id,
      organization,
    });

    if (!project) {
      throw new AppError("No project found with that ID", 404);
    }

    return;
  } catch (error) {
    throw error;
  }
}
