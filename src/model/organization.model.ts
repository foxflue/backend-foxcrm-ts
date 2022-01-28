import { Document, model, Schema } from "mongoose";

export interface OrganizationDocument extends Document {
  _id: string;
  email: string;
  phone: string;
  about: string;
  image: string;
  admin: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    image: {
      type: String,
    },
    admin: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Organization = model<OrganizationDocument>(
  "Organization",
  organizationSchema
);
