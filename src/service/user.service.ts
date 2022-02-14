import { Project } from "../model/project.model";
import { User } from "./../model/user.model";
import APIFeature from "./../utils/apiFeture.utils";

export async function FetchAll(organization: string, query: object) {
  try {
    const apiFeature = new APIFeature(User.find({ organization }), query)
      .filter()
      .search()
      .limitFields()
      .sort()
      .paginate();
    return await apiFeature.query;
  } catch (error) {
    throw error;
  }
}

export async function FetchOne(organization: string, _id: string) {
  try {
    const user = await User.findOne({ _id, organization }).populate({
      path: "projects",
      select: "-content",
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

export async function RemoveOne(query: string) {
  try {
    const user = await User.findByIdAndDelete(query).populate({
      path: "projects",
      select: "-content",
    });
    if (!user) {
      throw new Error("User not found");
    }
    // Delete User Projects
    await Project.deleteMany({ customer: query });

    return;
  } catch (error) {
    throw error;
  }
}

export async function Dashboard(id: string) {
  try {
    const projects = await Project.find({
      customer: id,
      status: "processing",
    })
      .limit(5)
      .sort({ createdAt: -1 });

    const payments = await Project.find({
      customer: id,
      status: "pending",
    })
      .limit(5)
      .sort({ createdAt: -1 });

    return { projects, payments };
  } catch (error) {
    throw error;
  }
}
