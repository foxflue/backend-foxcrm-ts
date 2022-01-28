import { DocumentDefinition } from "mongoose";
import APIFeatures from "../utils/apiFeture.utils";
import { Lead, LeadDocument } from "./../model/lead.model";

export async function CreateLead(input: DocumentDefinition<LeadDocument>) {
  try {
    return await Lead.create({
      name: input.name,
      email: input.email,
      message: input.message,
      meta: {
        purpose: input.purpose,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function FeatchAllLead(query: object) {
  try {
    const features = new APIFeatures(Lead.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await features.query;
  } catch (error) {
    throw error;
  }
}
