import mongoose from "mongoose";

export interface FileDocument extends mongoose.Document {
  path: string;
  createdAt: string;
}

const FileSchema = new mongoose.Schema(
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

const File = mongoose.model<FileDocument>("File", FileSchema);

export default File;
