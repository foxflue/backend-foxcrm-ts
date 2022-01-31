import { NextFunction, Request, Response } from "express";
import {
  CreatePost,
  DeletePost,
  FetchAllPost,
  FetchPost,
  UpdatePost,
} from "../service/post.service";
import catchAsync from "./../utils/catchAsync.utils";

const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await FetchAllPost(req.query);

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  }
);

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await CreatePost(req.body);

    res.status(201).json({
      status: "success",
      data: post,
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await FetchPost(req.body.slug);
    res.status(200).json({
      status: "success",
      data: post,
    });
  }
);

const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await UpdatePost(req.body.slug, req.body);
    res.status(200).json({
      status: "success",
      data: post,
    });
  }
);

const destroy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await DeletePost(req.body.slug);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export default {
  index,
  store,
  show,
  update,
  destroy,
};
