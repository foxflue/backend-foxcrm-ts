import crypto from "crypto";
import { Response } from "express";
import { DocumentDefinition } from "mongoose";
import razorpay from "razorpay";
import Payment, { PaymentDocument } from "../model/payment.model";
import { AppError } from "../utils/AppError.utils";
import Project, { ProjectDocument } from "./../model/project.model";
import APIFeatures from "./../utils/apiFeture.utils";

export async function CreatePayment(
  input: DocumentDefinition<PaymentDocument>
) {
  try {
    return await Payment.create(input);
  } catch (error) {
    throw error;
  }
}

export async function FetchAllPayment(query: object) {
  try {
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
      query
    )
      .filter()
      .limitFields()
      .sort()
      .paginate();

    return await features.query;
  } catch (error) {
    throw error;
  }
}

export async function FetchPayment(id: string, res: Response) {
  try {
    const payment = await Payment.findById(id).populate({
      path: "customer",
      select: "name",
    });

    if (!payment) {
      throw new AppError("No payment found with that ID", 404);
    }

    // For admin return the Payment Data only || If the payment is already done then return the payment object
    if (res.locals.user.roles.includes("admin")) {
      return { payment, paymentIntentResponse: undefined };
    }

    // Check if the payment is belong to the user
    if (payment.customer._id !== res.locals.user._id) {
      throw new AppError("You are not authorized to view this payment", 401);
    }

    if (payment.status === "success") {
      return { payment, paymentIntentResponse: undefined };
    }

    // For User send the Payment option so that they can pay
    let paymentIntentResponse = {};

    if (payment.gateway && Object(payment.gateway).order_id) {
      Object(paymentIntentResponse).order_id = Object(payment.gateway).order_id;
    } else {
      // Razoypay integration
      const paymentIntent = new razorpay({
        key_id: Object(process.env).RAZORPAY_KEY_ID,
        key_secret: Object(process.env).RAZORPAY_KEY_SECRET,
      });

      const paymentOptions = {
        amount: payment.amount * 100,
        currency: payment.currency || "INR",
        receipt: payment._id,
      };

      paymentIntentResponse = await paymentIntent.orders.create(paymentOptions);

      // Update the payment object with the payment intent id
      payment.gateway = Object(paymentIntentResponse).id;
      await payment.save();
    }

    return { payment, paymentIntentResponse };
  } catch (error) {
    throw error;
  }
}

export async function PaymentVerify({
  id,
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  res,
}: {
  id: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  res: Response;
}) {
  try {
    const payment: PaymentDocument = await Payment.findById(id).populate(
      "customer"
    );

    // Check if the payment is belong to the user
    if (payment.customer._id !== res.locals.user._id) {
      throw new AppError("You are not authorized to view this payment", 401);
    }
    // Check if the payment is already done
    if (payment.status === "success") {
      throw new AppError("Payment already done", 400);
    }

    // Check if the payment is done by razorpay
    const paymentDataString: string =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", Object(process.env).RAZORPAY_KEY_SECRET)
      .update(paymentDataString.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSignature) {
      throw new AppError("Payment not done by razorpay", 400);
    }

    // Update the payment object with the payment intent id
    payment.transaction_id = razorpay_payment_id as string;
    payment.status = "success" as string;
    await payment.save();

    // Update the project object with the payment id
    const project = (await Project.findById(
      payment.project
    )) as ProjectDocument;
    project.due_amount -= payment.amount as number;
    await project.save();

    return payment;
  } catch (error) {
    throw error;
  }
}

// const sendPaymentResponse = (res: Response, payment: object) => {
//   return res.status(200).json({
//     status: "success",
//     payment,
//     paymentIntentResponse: undefined,
//   });
// };
