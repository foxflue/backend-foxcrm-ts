import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";
import { User, UserDocument } from "./../model/user.model";
import catchAsync from "./../utils/catchAsync.utils";
// import Project from './../project/model.js';
// import APIFeature from './../../utils/apiFeature.js';

interface RegisterCredential {
  name: string;
  email: string;
  phone: string;
}
// const index = catchAsync(async (req, res, next) => {
//   const apiFeature = new APIFeature(User.find(), req.query)
//     .filter()
//     .search()
//     .limitFields()
//     .sort()
//     .paginate();
//   const users = await apiFeature.query;

//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: users,
//   });
// });

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.create(req.body as RegisterCredential);
    res.status(201).json({
      status: "success",
      message: "User has been added",
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = await User.findById(
      req.params.id as string
    ).populate({
      path: "projects",
      select: "-content",
    });
    if (!user) {
      return next(new Error("User not found"));
    }
    res.status(200).json({
      status: "success",
      data: omit(user.toJSON(), "password"),
    });
  }
);

// const destroy = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user = await User.findByIdAndDelete(req.params.id as string);
//     if (!user) {
//       return next(new Error("User not found"));
//     }

//     // Delete User Projects
//     await Project.deleteMany({ customer: req.params.id });

//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   }
// );

// const dashboard = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const projects = await Project.find({
//       customer: req.user.id,
//       status: "processing",
//     })
//       .limit(5)
//       .sort({ createdAt: -1 });

//     const payments = await Project.find({
//       customer: req.user.id,
//       status: "pending",
//     })
//       .limit(5)
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       status: "success",
//       data: {
//         projects,
//         payments,
//       },
//     });
//   }
// );

export default {
  // index,
  store,
  show,
  // destroy,
  // dashboard
};
