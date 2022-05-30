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
exports.Dashboard = exports.RemoveOne = exports.FetchOne = exports.FetchAll = void 0;
const project_model_1 = require("../model/project.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const user_model_1 = require("./../model/user.model");
const apiFeture_utils_1 = __importDefault(require("./../utils/apiFeture.utils"));
function FetchAll(organization, query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiFeature = new apiFeture_utils_1.default(user_model_1.User.find({ organization }), query)
                .filter()
                .search()
                .limitFields()
                .sort()
                .paginate();
            return yield apiFeature.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchAll = FetchAll;
function FetchOne(organization, _id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findOne({ _id, organization }).populate({
                path: "projects",
                select: "-content",
            });
            if (!user) {
                throw new AppError_utils_1.AppError("User not found", 404);
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchOne = FetchOne;
function RemoveOne(organization, _id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findOneAndDelete({ _id, organization }).populate({
                path: "projects",
                select: "-content",
            });
            if (!user) {
                throw new AppError_utils_1.AppError("User not found", 404);
            }
            // Delete User Projects
            yield project_model_1.Project.deleteMany({ customer: _id });
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.RemoveOne = RemoveOne;
function Dashboard(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projects = yield project_model_1.Project.find({
                customer: id,
                status: "processing",
            })
                .limit(5)
                .sort({ createdAt: -1 });
            const payments = yield project_model_1.Project.find({
                customer: id,
                status: "pending",
            })
                .limit(5)
                .sort({ createdAt: -1 });
            return { projects, payments };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.Dashboard = Dashboard;
