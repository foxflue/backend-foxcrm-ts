import { NextFunction, Request, Response } from "express";
import Post, { PostDocument } from "./../model/post.model";
// import APIFeatures from './../../utils/apiFeature.js';
import { AppError } from "./../utils/AppError.utils";
import catchAsync from "./../utils/catchAsync.utils";
import hook from "./../utils/hook";

// const index = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
//   const features = new APIFeatures(Post.find().select('-content'), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const posts = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: posts.length,
//     data: posts,
//   });
// });

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post: PostDocument = await Post.create(req.body);
    await hook();
    res.status(201).json({
      status: "success",
      data: post,
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = (await Post.findOne({
      slug: req.params.slug as string,
    })) as PostDocument;

    if (!post) {
      return next(new AppError("No post found with that", 404));
    }
    res.status(200).json({
      status: "success",
      data: post,
    });
  }
);

const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = (await Post.findOneAndUpdate(
      {
        slug: req.params.slug as string,
      },
      req.body
    )) as PostDocument;

    if (!post) {
      return next(new AppError("No post found with that slug", 404));
    }
    await hook();

    res.status(200).json({
      status: "success",
      data: post,
    });
  }
);

const destroy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = (await Post.findOneAndDelete({
      slug: req.params.slug as string,
    })) as PostDocument;

    if (!post) {
      return next(new AppError("No post found with that slug", 404));
    }
    await hook();

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export default {
  // index,
  store,
  show,
  update,
  destroy,
};