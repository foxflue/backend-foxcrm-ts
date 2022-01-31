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
    const projects = await FetchAllProject(
      res.locals.user.organization,
      req.query
    );

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: projects,
    });
  }
);

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await CreateProject(res.locals.user.organization, req.body);
    res.status(201).json({
      status: "success",
      data: project,
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await FetchProject(
      res.locals.user.organization,
      req.params.id
    );
    res.status(200).json({
      status: "success",
      data: project,
    });
  }
);

const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await UpdateProject(
      res.locals.user.organization,
      req.params.id,
      req.body
    );

    res.status(200).json({
      status: "success",
      data: project,
    });
  }
);

const destroy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await DeleteProject(res.locals.user.organization, req.params.id);

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
