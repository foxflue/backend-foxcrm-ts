import aws from "aws-sdk";
import { DocumentDefinition } from "mongoose";
import APIFeatures from "../utils/apiFeture.utils";
import { AppError } from "../utils/AppError.utils";
import File, { FileDocument } from "./../model/file.model";

const s3 = new aws.S3({
  accessKeyId: Object(process.env).AWS_ACCESS_KEY_ID,
  secretAccessKey: Object(process.env).AWS_SECRET_ACCESS_KEY,
  region: Object(process.env).AWS_REGION,
});

export async function CreateFile(input: DocumentDefinition<FileDocument>) {
  try {
    return await File.create(input);
  } catch (error) {
    throw error;
  }
}

export async function FetchAllFile(query: object) {
  try {
    const features = new APIFeatures(File.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await features.query;
  } catch (error) {
    throw error;
  }
}

export async function DeleteFile(id: string) {
  try {
    const file = await File.findById(id);

    if (!file) {
      throw new AppError("No file found with that ID", 404);
    }

    const params = {
      Bucket: Object(process.env).AWS_BUCKET_NAME,
      Key: file.path,
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        throw new AppError("Could not delete file", 500);
      }
    });

    await file.remove();

    return;
  } catch (error) {
    throw error;
  }
}
