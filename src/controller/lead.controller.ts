// import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from "express";
import { CreateLead, FeatchAllLead } from "../service/lead.service";
import catchAsync from "./../utils/catchAsync.utils";
import emailHolper from "./../utils/emailHandler.utils";

const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const leads = await FeatchAllLead(req.query);

    res.status(200).json({
      status: "success",
      result: leads.length,
      data: leads,
    });
  }
);

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const lead = await CreateLead(req.body);
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
  }
);

export default {
  index,
  store,
};
