import { Document, model, Schema } from "mongoose";
import { ProjectDocument } from "./project.model";
import { UserDocument } from "./user.model";

export interface PaymentDocument extends Document {
  project: ProjectDocument["_id"];
  customer: UserDocument["_id"];
  gateway: object;
  transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    gateway: {
      type: Object,
    },
    transaction_id: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "INR"],
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Payment = model<PaymentDocument>("Payment", PaymentSchema);
