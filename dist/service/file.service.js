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
exports.DeleteFile = exports.FetchAllFile = exports.CreateFile = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const apiFeture_utils_1 = __importDefault(require("../utils/apiFeture.utils"));
const AppError_utils_1 = require("../utils/AppError.utils");
const file_model_1 = require("./../model/file.model");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: Object(process.env).AWS_ACCESS_KEY_ID,
    secretAccessKey: Object(process.env).AWS_SECRET_ACCESS_KEY,
    region: Object(process.env).AWS_REGION,
});
function CreateFile(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield file_model_1.File.create(input);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.CreateFile = CreateFile;
function FetchAllFile(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new apiFeture_utils_1.default(file_model_1.File.find(), query)
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
exports.FetchAllFile = FetchAllFile;
function DeleteFile(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = yield file_model_1.File.findById(id);
            if (!file) {
                throw new AppError_utils_1.AppError("No file found with that ID", 404);
            }
            const params = {
                Bucket: Object(process.env).AWS_BUCKET_NAME,
                Key: file.path,
            };
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    throw new AppError_utils_1.AppError("Could not delete file", 500);
                }
            });
            yield file.remove();
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.DeleteFile = DeleteFile;
