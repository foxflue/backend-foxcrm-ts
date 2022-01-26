import { DocumentDefinition } from "mongoose";
import Project, { ProjectDocument } from "../model/project.model";
import APIFeatures from "../utils/apiFeture.utils";
import { AppError } from "../utils/AppError.utils";

export async function CreateProject(
  input: DocumentDefinition<ProjectDocument>
) {
  try {
    input.due_amount = input.price;
    return await Project.create(input);
  } catch (error) {
    throw error;
  }
}

export async function FetchAllProject(query: object) {
  try {
    const features = new APIFeatures(Project.find().populate("customer"), query)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    return await features.query;
  } catch (error) {
    throw error;
  }
}

export async function FetchProject(id: string) {
  try {
    const project = await Project.findById(id).populate("customer payments");

    if (!project) {
      throw new AppError("No project found with that ID", 404);
    }
    return project;
  } catch (error) {
    throw error;
  }
}

export async function UpdateProject(
  id: string,
  input: DocumentDefinition<ProjectDocument>
) {
  try {
    const project = await Project.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      throw new AppError("No project found with that ID", 404);
    }

    return project;
  } catch (error) {
    throw error;
  }
}

export async function DeleteProject(id: string) {
  try {
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      throw new AppError("No project found with that ID", 404);
    }

    return;
  } catch (error) {
    throw error;
  }
}
