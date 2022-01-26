import { NextFunction, Request, Response } from "express";
import {
  CreateProject,
  DeleteProject,
  FetchAllProject,
  FetchProject,
  UpdateProject,
} from "../service/project.service";
import catchAsync from "./../utils/catchAsync.utils";

const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const projects = await FetchAllProject(req.query);

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: projects,
    });
  }
);

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await CreateProject(req.body);
    res.status(201).json({
      status: "success",
      data: project,
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await FetchProject(req.params.id);
    res.status(200).json({
      status: "success",
      data: project,
    });
  }
);

const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await UpdateProject(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: project,
    });
  }
);

const destroy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await DeleteProject(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export default {
  index,
  show,
  store,
  update,
  destroy,
};
