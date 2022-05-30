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
exports.DeleteProject = exports.UpdateProject = exports.FetchProject = exports.FetchAllProject = exports.CreateProject = void 0;
const project_model_1 = require("../model/project.model");
const apiFeture_utils_1 = __importDefault(require("../utils/apiFeture.utils"));
const AppError_utils_1 = require("../utils/AppError.utils");
function CreateProject(user, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            input.due_amount = input.price;
            input.customer = user._id;
            input.organization = user.organization;
            return yield project_model_1.Project.create(input);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.CreateProject = CreateProject;
function FetchAllProject(organization, query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new apiFeture_utils_1.default(project_model_1.Project.find({ organization }).populate("customer"), query)
                .filter()
                .limitFields()
                .sort()
                .paginate();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchAllProject = FetchAllProject;
function FetchProject(organization, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield project_model_1.Project.findOne({
                _id: id,
                organization,
            }).populate("customer payments");
            if (!project) {
                throw new AppError_utils_1.AppError("No project found with that ID", 404);
            }
            return project;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchProject = FetchProject;
function UpdateProject(organization, id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield project_model_1.Project.findOneAndUpdate({ _id: id, organization }, input, {
                new: true,
                runValidators: true,
            });
            if (!project) {
                throw new AppError_utils_1.AppError("No project found with that ID", 404);
            }
            return project;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.UpdateProject = UpdateProject;
function DeleteProject(organization, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const project = yield project_model_1.Project.findOneAndDelete({
                _id: id,
                organization,
            });
            if (!project) {
                throw new AppError_utils_1.AppError("No project found with that ID", 404);
            }
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.DeleteProject = DeleteProject;
