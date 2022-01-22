import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import razorpay from "razorpay";
import Payment, { PaymentDocument } from "./../model/payment.model";
import Project, { ProjectDocument } from "./../model/project.model";
import APIFeatures from "./../utils/apiFeture.utils";
import { AppError } from "./../utils/AppError.utils";
import catchAsync from "./../utils/catchAsync.utils";

type paymentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | object;

const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Payment.find()
      .populate({
        path: "customer",
        select: "name",
      })
      .populate({
        path: "project",
        select: "title",
      }),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const payments = await features.query;

  res.status(200).json({
    status: "success",
    results: payments.length,
    data: payments,
  });
});

const store: paymentType = catchAsync(async (req, res, next) => {
  const payment: PaymentDocument = await Payment.create(req.body);
  res.status(201).json({
    status: "success",
    data: payment,
  });
});

const show: paymentType = catchAsync(async (req, res, next) => {
  const payment: PaymentDocument = await Payment.findById(
    req.params.id as string
  ).populate({
    path: "customer",
    select: "name",
  });

  if (!payment) {
    return next(new AppError("No payment found with that ID", 404));
  }

  // For admin return the Payment Data only || If the payment is already done then return the payment object
  if (res.locals.user.role === "admin") {
    return sendPaymentResponse(res, payment);
  }

  // Check if the payment is belong to the user
  if (payment.customer._id !== res.locals.user._id) {
    return next(
      new AppError("You are not authorized to view this payment", 401)
    );
  }

  if (payment.status === "success") {
    return sendPaymentResponse(res, payment);
  }

  // For User send the Payment option so that they can pay
  let paymentIntentResponse: object = {};

  if (payment.gateway && Object(payment.gateway).order_id) {
    Object(paymentIntentResponse).order_id = Object(payment.gateway).order_id;
  } else {
    // Razoypay integration
    const paymentIntent = new razorpay({
      key_id: Object(process.env).RAZORPAY_KEY_ID,
      key_secret: Object(process.env).RAZORPAY_KEY_SECRET,
    });

    const paymentOptions: object = {
      amount: payment.amount * 100,
      currency: payment.currency || "INR",
      receipt: payment._id,
    };

    paymentIntentResponse = await paymentIntent.orders.create(paymentOptions);

    // Update the payment object with the payment intent id
    payment.gateway = Object(paymentIntentResponse).id;
    await payment.save();
  }

  res.status(201).json({
    status: "success",
    data: {
      payment,
      paymentIntentResponse,
    },
  });
});

const sendPaymentResponse = (res: Response, payment: object) => {
  return res.status(200).json({
    status: "success",
    data: payment,
  });
};

const verifyPayment: paymentType = catchAsync(async (req, res, next) => {
  const id = req.params.id as string;
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  }: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  } = req.body;

  const payment: PaymentDocument = await Payment.findById(id).populate(
    "customer"
  );

  // Check if the payment is belong to the user
  if (payment.customer._id !== res.locals.user._id) {
    return next(
      new AppError("You are not authorized to view this payment", 401)
    );
  }
  // Check if the payment is already done
  if (payment.status === "success") {
    return next(new AppError("Payment already done", 400));
  }

  // Check if the payment is done by razorpay
  const paymentDataString: string =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature: string = crypto
    .createHmac("sha256", Object(process.env).RAZORPAY_KEY_SECRET)
    .update(paymentDataString.toString())
    .digest("hex");

  console.log({ expectedSignature }, { razorpay_signature });
  if (razorpay_signature !== expectedSignature) {
    return next(new AppError("Payment not done by razorpay", 400));
  }

  // Update the payment object with the payment intent id
  payment.transaction_id = razorpay_payment_id as string;
  payment.status = "success" as string;
  await payment.save();

  // Update the project object with the payment id
  const project = (await Project.findById(payment.project)) as ProjectDocument;
  project.due_amount -= payment.amount as number;
  await project.save();

  res.status(200).json({
    status: "success",
    data: payment,
  });
});

const update: paymentType = catchAsync(async (req, res, next) => {});

export default {
  index,
  show,
  store,
  update,
  verifyPayment,
};
