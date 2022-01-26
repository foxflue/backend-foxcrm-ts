import mongoose from "mongoose";
import { encryptedPassword } from "../utils/passwordEncrypt.utils";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  oauth_id: string;
  two_fa: {
    mode: boolean;
    base32: string | undefined;
  };
  company: string;
  address: AddressDocument;
  role: string;
  verification_token: string | undefined;
  verification_expiring_at: number | undefined;
  reset_token: string | undefined;
  reset_expiring_at: number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressDocument {
  address_line1: string;
  address_line2: string;
  country: string;
  city: string;
  zipcode: number;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: [true, "Email address is already in use"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    password: {
      type: String,
      select: false,
    },
    oauth_id: {
      type: String,
    },
    two_fa: {
      mode: Boolean,
      base32: String,
    },
    company: {
      type: String,
    },
    address: {
      address_line1: {
        type: String,
        trim: true,
      },
      address_line2: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      zipcode: {
        type: Number,
      },
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    verification_token: {
      type: String,
    },
    verification_expiring_at: {
      type: Date,
    },
    reset_token: {
      type: String,
    },
    reset_expiring_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.index({ email: 1 });

// Virtual populate for Projects
UserSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "customer",
});

UserSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // hash password
  user.password = await encryptedPassword(user.password);

  next();
});

export const User = mongoose.model<UserDocument>("User", UserSchema);
