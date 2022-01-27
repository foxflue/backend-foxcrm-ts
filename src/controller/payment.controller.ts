import { NextFunction, Request, Response } from "express";
import {
  CreatePayment,
  FetchAllPayment,
  FetchPayment,
  PaymentVerify,
} from "../service/payment.service";
import catchAsync from "./../utils/catchAsync.utils";

const index = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payments = await FetchAllPayment(req.query);

    res.status(200).json({
      status: "success",
      results: payments.length,
      data: payments,
    });
  }
);

const store = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payment = await CreatePayment(req.body);
    res.status(201).json({
      status: "success",
      data: payment,
    });
  }
);

const show = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { payment, paymentIntentResponse } = await FetchPayment(
      req.params.id,
      res
    );

    res.status(201).json({
      status: "success",
      data: {
        payment,
        paymentIntentResponse,
      },
    });
  }
);

const verifyPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payment = await PaymentVerify({
      id: req.params.id,
      razorpay_payment_id: req.body.razorpay_payment_id,
      razorpay_order_id: req.body.razorpay_order_id,
      razorpay_signature: req.body.razorpay_signature,
      res,
    });
    res.status(200).json({
      status: "success",
      data: payment,
    });
  }
);

export default {
  index,
  show,
  store,
  verifyPayment,
};
