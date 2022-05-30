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
const file_service_1 = require("../service/file.service");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const index = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield (0, file_service_1.FetchAllFile)(req.body);
    res.status(200).json({
        status: "success",
        results: files.length,
        data: files,
    });
}));
const store = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Store the file to AWS S3
    const file = yield (0, file_service_1.CreateFile)(req.body);
    res.status(201).json({
        status: "success",
        data: file,
    });
}));
// Get signed url from AWS S3
// const getSignedUrl: fileType = catchAsync(async (req, res, next) => {
//   const { file } = req.body;
//   console.log(file);
//   if (!file) {
//     return next(new AppError("No file was uploaded", 400));
//   }
//   const name: string = file.name.split(".")[0];
//   const extension: string = file.name.split(".").pop();
//   // Generate a unique filename
//   const fileName: string = `media/${name}-${Date.now()}.${extension}`;
//   const url = s3.getSignedUrl("putObject", {
//     Bucket: Object(process.env).AWS_BUCKET_NAME,
//     ContentType: file.type,
//     Key: fileName,
//   });
//   res.status(200).json({
//     status: "success",
//     data: {
//       signedUrl: url,
//       key: fileName,
//     },
//   });
// });
// Delete file
const destroy = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, file_service_1.DeleteFile)(req.params.id);
    res.status(200).json({
        status: "success",
        data: null,
    });
}));
exports.default = {
    index,
    store,
    // getSignedUrl,
    destroy,
};
