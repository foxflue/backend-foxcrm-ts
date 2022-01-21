import mongoose from "mongoose";

export interface BackupDocument extends mongoose.Document {
  path: string;
  created: Date;
}

const BackupSchema = new mongoose.Schema(
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

const Backup = mongoose.model<BackupDocument>("Backup", BackupSchema);

export default Backup;
