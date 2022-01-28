import { DocumentDefinition, FilterQuery } from "mongoose";
import { Post, PostDocument } from "../model/post.model";
import APIFeatures from "../utils/apiFeture.utils";
import { AppError } from "../utils/AppError.utils";
import hook from "../utils/hook";

export async function CreatePost(input: DocumentDefinition<PostDocument>) {
  try {
    const post = await Post.create(input);
    await hook();
    return post;
  } catch (error) {
    throw error;
  }
}

export async function FetchAllPost(query: object) {
  try {
    const features = new APIFeatures(Post.find().select("-content"), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await features.query;
  } catch (error) {
    throw error;
  }
}

export async function FetchPost(slug: FilterQuery<PostDocument>) {
  try {
    const post = await Post.findOne({ slug });

    if (!post) {
      throw new AppError("No post found with that", 404);
    }
    return post;
  } catch (error) {
    throw error;
  }
}
export async function UpdatePost(
  slug: FilterQuery<PostDocument>,
  input: DocumentDefinition<PostDocument>
) {
  try {
    const post = await Post.findOneAndUpdate(slug, input);

    if (!post) {
      throw new AppError("No post found with that slug", 404);
    }
    await hook();

    return post;
  } catch (error) {
    throw error;
  }
}

export async function DeletePost(slug: FilterQuery<PostDocument>) {
  try {
    const post = await Post.findOneAndDelete({ slug });

    if (!post) {
      throw new AppError("No post found with that slug", 404);
    }
    await hook();

    return;
  } catch (error) {
    throw error;
  }
}
