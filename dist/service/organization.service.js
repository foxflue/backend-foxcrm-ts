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
exports.DeleteOrg = exports.UpdateOrg = exports.FetchOrg = exports.FetchAllOrg = exports.CreateOrg = void 0;
const organization_model_1 = require("../model/organization.model");
const apiFeture_utils_1 = __importDefault(require("../utils/apiFeture.utils"));
const AppError_utils_1 = require("../utils/AppError.utils");
function CreateOrg(user, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            input.email = user.email;
            input.phone = user.phone;
            input.admin = user._id;
            const organization = yield organization_model_1.Organization.create(input);
            user.organization = organization._id;
            yield user.save();
            return organization;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.CreateOrg = CreateOrg;
function FetchAllOrg(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new apiFeture_utils_1.default(organization_model_1.Organization.find(), query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchAllOrg = FetchAllOrg;
function FetchOrg(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organization = yield organization_model_1.Organization.findById(id);
            if (!organization) {
                throw new AppError_utils_1.AppError("Not found", 404);
            }
            return organization;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchOrg = FetchOrg;
function UpdateOrg(id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organization = yield organization_model_1.Organization.findByIdAndUpdate(id, input);
            if (!organization) {
                throw new AppError_utils_1.AppError("Not found", 404);
            }
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.UpdateOrg = UpdateOrg;
function DeleteOrg(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const organization = yield organization_model_1.Organization.findByIdAndDelete(id);
            if (!organization) {
                throw new AppError_utils_1.AppError("Not found", 404);
            }
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.DeleteOrg = DeleteOrg;
