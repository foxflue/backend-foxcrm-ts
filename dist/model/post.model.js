"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
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
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Organization",
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
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
PostSchema.index({ slug: 1 });
exports.Post = (0, mongoose_1.model)("Post", PostSchema);
