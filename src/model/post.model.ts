import mongoose from "mongoose";

export interface PostDocument extends mongoose.Document {
  type: string;
  title: string;
  slug: string;
  content: string;
  options: object;
  excerpt: string;
  featured_image: string;
  status: string;
  meta: {
    description: string;
    keyword: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["post", "page", "portfolio"],
      default: "post",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    options: {
      type: Object,
    },
    excerpt: {
      type: String,
    },
    featured_image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "trash"],
      default: "published",
    },
    meta: {
      description: {
        type: String,
      },
      keywords: {
        type: String,
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

PostSchema.index({ slug: 1 });

const Post = mongoose.model<PostDocument>("Post", PostSchema);

export default Post;
