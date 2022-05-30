"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_model_1 = require("../model/project.model");
const user_model_1 = require("../model/user.model");
const catchAsync_utils_1 = __importDefault(require("../utils/catchAsync.utils"));
const getStats = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate the sum off all the Projects amount and due_amount
    const projectsStats = yield project_model_1.Project.aggregate([
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
    const monthlyStats = yield project_model_1.Project.aggregate([
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
    const usersStats = yield user_model_1.User.aggregate([
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
}));
exports.default = { getStats };
