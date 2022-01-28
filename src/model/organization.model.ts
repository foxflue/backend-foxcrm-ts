import { Document, model, Schema } from "mongoose";

export interface OrganizationDocument extends Document {
  _id: string;
  title: string;
  email: string;
  phone: string;
  about: string;
  image: string;
  admin: string;
  verification_token: string | undefined;
  verification_expiring_at: number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
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
    verification_token: String,
    verification_expiring_at: Date,
  },
  {
    timestamps: true,
  }
);

export const Organization = model<OrganizationDocument>(
  "Organization",
  organizationSchema
);
