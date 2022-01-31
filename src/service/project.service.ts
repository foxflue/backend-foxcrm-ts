import { DocumentDefinition } from "mongoose";
import { OrganizationDocument } from "../model/organization.model";
import { Project, ProjectDocument } from "../model/project.model";
import APIFeatures from "../utils/apiFeture.utils";
import { AppError } from "../utils/AppError.utils";

export async function CreateProject(
  id: OrganizationDocument["_id"],
  input: DocumentDefinition<ProjectDocument>
) {
  try {
    input.due_amount = input.price;
    input.organization = id;
    return await Project.create(input);
  } catch (error) {
    throw error;
  }
}

export async function FetchAllProject(
  id: OrganizationDocument["_id"],
  query: object
) {
  try {
    const features = new APIFeatures(
      Project.find({ organization: id }).populate("customer"),
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
  org_id: OrganizationDocument["_id"],
  id: string
) {
  try {
    const project = await Project.findOne({
      _id: id,
      organization: org_id,
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
  org_id: OrganizationDocument["_id"],
  id: string,
  input: DocumentDefinition<ProjectDocument>
) {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: id, organization: org_id },
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
  org_id: OrganizationDocument["_id"],
  id: string
) {
  try {
    const project = await Project.findOneAndDelete({
      _id: id,
      organization: org_id,
    });

    if (!project) {
      throw new AppError("No project found with that ID", 404);
    }

    return;
  } catch (error) {
    throw error;
  }
}
