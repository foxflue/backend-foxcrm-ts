import aws from "aws-sdk";
import { NextFunction, Request, Response } from "express";
import File, { FileDocument } from "./../model/file.model";
import APIFeatures from "./../utils/apiFeture.utils";
import { AppError } from "./../utils/AppError.utils";
import catchAsync from "./../utils/catchAsync.utils";

type fileType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | object;

const s3 = new aws.S3({
  accessKeyId: Object(process.env).AWS_ACCESS_KEY_ID,
  secretAccessKey: Object(process.env).AWS_SECRET_ACCESS_KEY,
  region: Object(process.env).AWS_REGION,
});

const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(await File.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const files = await features.query;

  res.status(200).json({
    status: "success",
    results: files.length,
    data: files,
  });
});

const store: fileType = catchAsync(async (req, res, next) => {
  // Store the file to AWS S3
  const file: FileDocument = await File.create(req.body);
  res.status(201).json({
    status: "success",
    data: file,
  });
});

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
const destroy: fileType = catchAsync(async (req, res, next) => {
  const file = (await File.findById(req.params.id as string)) as FileDocument;

  if (!file) {
    return next(new AppError("No file found with that ID", 404));
  }

  const params = {
    Bucket: Object(process.env).AWS_BUCKET_NAME,
    Key: file.path,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      return next(new AppError("Could not delete file", 500));
    }
  });

  await file.remove();

  res.status(200).json({
    status: "success",
    data: null,
  });
});

export default {
  index,
  store,
  // getSignedUrl,
  destroy,
};
