import { NextFunction, Request, Response } from "express";
import { CreateFile, DeleteFile, FetchAllFile } from "../service/file.service";
import catchAsync from "./../utils/catchAsync.utils";

const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = await FetchAllFile(req.body);

    res.status(200).json({
      status: "success",
      results: files.length,
      data: files,
    });
  }
);

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Store the file to AWS S3
    const file = await CreateFile(req.body);

    res.status(201).json({
      status: "success",
      data: file,
    });
  }
);

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

const destroy = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await DeleteFile(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  }
);

export default {
  index,
  store,
  // getSignedUrl,
  destroy,
};
