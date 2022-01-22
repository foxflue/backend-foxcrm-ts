import axios from "axios";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.utils";

const checkCaptcha = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.body.token;
    const secret = Object(process.env).RECAPTCHA_SITE_SECRET;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    const response: object = await axios.post(url);
    if (!Object(response).data.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid captcha",
      });
    }
    next();
  }
);

export default checkCaptcha;
