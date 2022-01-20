import mongoose from "mongoose";

export interface ProjectDocument extends mongoose.Document {
  title: string;
  content: string;
  entities: string[];
  customer: string;
  currency: string;
  price: number;
  due_amount: number;
  starting_date: Date;
  delivery_at: Date;
  delivered_at: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    entities: [
      {
        type: String,
      },
    ],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      required: [true, "Currency is required"],
      default: "USD",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    due_amount: {
      type: Number,
    },
    starting_date: {
      type: Date,
    },
    delivery_at: {
      type: Date,
    },
    delivered_at: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["processing", "delivered", "canceled"],
      default: "processing",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
  }
);

// Associated Payments
// ProjectSchema.virtual('payments', {
//   ref: 'Payment',
//   localField: '_id',
//   foreignField: 'project',
// });

// Virtual Due Amount for Project
// ProjectSchema.virtual('payment_made').get(function () {
//   let totalPayment = 0;
//   if (this.payments && this.payments.length > 0) {
//     this.payments.forEach((payment) => {
//       totalPayment += payment.amount;
//     });
//   }
//   return this.price ? (this.price - totalPayment).toFixed(2) : 0;
// });

const Project = mongoose.model<ProjectDocument>("Project", ProjectSchema);

export default Project;
