import { NextFunction, Request, Response } from "express";
import { Project } from "../model/project.model";
import { User } from "../model/user.model";
import catchAsync from "../utils/catchAsync.utils";

const getStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Calculate the sum off all the Projects amount and due_amount
    const projectsStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
          totalDueAmount: { $sum: "$due_amount" },
          totalProjects: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    // Calculate monthly sales
    const monthlyStats = await Project.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },

          totalAmount: { $sum: "$price" },
          totalDueAmount: { $sum: "$due_amount" },
          totalProjects: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Count sum off the user with role 'user'
    const usersStats = await User.aggregate([
      {
        $match: { role: "user" },
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    // Send the response
    res.status(200).json({
      status: "success",
      project_stats: projectsStats[0],
      user_stats: usersStats[0],
      monthly_stats: monthlyStats,
    });
  }
);

export default { getStats };
