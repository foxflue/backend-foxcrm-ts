// import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";
import Lead from "./../model/lead.model";
import APIFeatures from "./../utils/apiFeture.utils";
import catchAsync from "./../utils/catchAsync.utils";
import emailHolper from "./../utils/emailHandler.utils";

type leadType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | object;

const index: leadType = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(await Lead.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const leads = await features.query;

  res.status(200).json({
    status: "success",
    result: leads.length,
    data: leads,
  });
});

const store: leadType = catchAsync(async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({
  //     error: {
  //       ...errors,
  //     },
  //   });
  // }

  const leadData = req.body;

  const lead = await Lead.create({
    name: leadData.name as string,
    email: leadData.email as string,
    message: leadData.message as string,
    meta: {
      purpose: leadData.purpose as string,
    },
  });

  if (lead) {
    await emailHolper.sendEmail({
      email: "hello@foxflue.com",
      subject: "New Lead",
      body: `
        Name: ${lead.name}
        Email: ${lead.email}
        Message: ${lead.message}
        Purpose: ${Object(lead.meta).purpose}
      `,
    });
  }

  res.status(201).json({
    status: "success",
  });
});

export default {
  index,
  store,
};
