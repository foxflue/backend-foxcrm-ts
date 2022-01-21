// import APIFeatures from './../../utils/apiFeature.js';
import { NextFunction, Request, Response } from "express";
import Project, { ProjectDocument } from "./../model/project.model";
import catchAsync from "./../utils/catchAsync.utils";

type projectType = (
  req: Request,
  res: Response,
  next: NextFunction
) => object | void;

// const index = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(
//     Project.find().populate('customer'),
//     req.query
//   )
//     .filter()
//     .limitFields()
//     .sort()
//     .paginate();

//   const projects = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: projects.length,
//     data: projects,
//   });
// });

/**
 * Save a new project
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Object}
 * @memberof ProjectController
 * @route POST /api/v1/project/
 */
const store: projectType = catchAsync(async (req, res, next) => {
  req.body.due_amount = req.body.price as number;
  const project = await Project.create(req.body);
  res.status(201).json({
    status: "success",
    data: project,
  });
});

/**
 * View a single project
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Object}
 * @memberof ProjectController
 * @route GET /api/v1/project/:id
 */
const show: projectType = catchAsync(async (req, res, next) => {
  const project: ProjectDocument = await Project.findById(
    req.params.id as string
  ).populate("customer payments");

  if (!project) {
    return next(new Error("No project found with that ID"));
  }

  res.status(200).json({
    status: "success",
    data: project,
  });
});

/**
 * Update project
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Object}
 * @memberof ProjectController
 * @route PATCH /api/v1/project/:id
 */
const update: projectType = catchAsync(async (req, res, next) => {
  const project = (await Project.findByIdAndUpdate(
    req.params.id as string,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )) as ProjectDocument;

  if (!project) {
    return next(new Error("No project found with that ID"));
  }

  res.status(200).json({
    status: "success",
    data: project,
  });
});

/**
 * Delete project
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Object}
 * @returns {Object}
 * @memberof ProjectController
 * @route DELETE /api/v1/project/:id
 */
const destroy: projectType = catchAsync(async (req, res, next) => {
  const project = (await Project.findByIdAndDelete(
    req.params.id
  )) as ProjectDocument;

  if (!project) {
    return next(new Error("No project found with that ID"));
  }

  // Delete Payments attached to Project

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default {
  // index,
  show,
  store,
  update,
  destroy,
};
