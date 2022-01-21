import mongoose from "mongoose";

export interface LeadDocument extends mongoose.Document {
  name: string;
  email: string;
  message: string;
  meta: {
    purpose: string;
  };
  createdAt: Date;
}

const LeadSchema = new mongoose.Schema(
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

const Lead = mongoose.model<LeadDocument>("Lead", LeadSchema);

export default Lead;
