import { Document, model, Schema } from "mongoose";

export interface FileDocument extends Document {
  _id: string;
  path: string;
  createdAt: string;
}

const FileSchema = new Schema(
  {
    path: {
      type: String,
      required: [true, "Path is required"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

export const File = model<FileDocument>("File", FileSchema);
