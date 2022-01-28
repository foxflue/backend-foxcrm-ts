import { Document, model, Schema } from "mongoose";

export interface LeadDocument extends Document {
  name: string;
  email: string;
  message: string;
  purpose: string;
  meta: object;
  createdAt: Date;
}

const LeadSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    meta: {
      purpose: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

export const Lead = model<LeadDocument>("Lead", LeadSchema);
