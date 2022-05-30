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
exports.PaymentVerify = exports.FetchPayment = exports.FetchAllPayment = exports.CreatePayment = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const payment_model_1 = require("../model/payment.model");
const AppError_utils_1 = require("../utils/AppError.utils");
const project_model_1 = require("./../model/project.model");
const apiFeture_utils_1 = __importDefault(require("./../utils/apiFeture.utils"));
function CreatePayment(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield payment_model_1.Payment.create(input);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.CreatePayment = CreatePayment;
function FetchAllPayment(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new apiFeture_utils_1.default(payment_model_1.Payment.find()
                .populate({
                path: "customer",
                select: "name",
            })
                .populate({
                path: "project",
                select: "title",
            }), query)
                .filter()
                .limitFields()
                .sort()
                .paginate();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchAllPayment = FetchAllPayment;
function FetchPayment(id, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payment = yield payment_model_1.Payment.findById(id).populate({
                path: "customer",
                select: "name",
            });
            if (!payment) {
                throw new AppError_utils_1.AppError("No payment found with that ID", 404);
            }
            // For admin return the Payment Data only || If the payment is already done then return the payment object
            if (res.locals.user.roles.includes("admin")) {
                return { payment, paymentIntentResponse: undefined };
            }
            // Check if the payment is belong to the user
            if (payment.customer !== res.locals.user._id) {
                throw new AppError_utils_1.AppError("You are not authorized to view this payment", 401);
            }
            if (payment.status === "success") {
                return { payment, paymentIntentResponse: undefined };
            }
            // For User send the Payment option so that they can pay
            let paymentIntentResponse = {};
            if (payment.gateway && Object(payment.gateway).order_id) {
                Object(paymentIntentResponse).order_id = Object(payment.gateway).order_id;
            }
            else {
                // Razoypay integration
                const paymentIntent = new razorpay_1.default({
                    key_id: Object(process.env).RAZORPAY_KEY_ID,
                    key_secret: Object(process.env).RAZORPAY_KEY_SECRET,
                });
                const paymentOptions = {
                    amount: payment.amount * 100,
                    currency: payment.currency || "INR",
                    receipt: payment._id,
                };
                paymentIntentResponse = yield paymentIntent.orders.create(paymentOptions);
                // Update the payment object with the payment intent id
                payment.gateway = Object(paymentIntentResponse).id;
                yield payment.save();
            }
            return { payment, paymentIntentResponse };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchPayment = FetchPayment;
function PaymentVerify({ id, razorpay_payment_id, razorpay_order_id, razorpay_signature, res, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payment = yield payment_model_1.Payment.findById(id).populate("customer");
            // Check if the payment is belong to the user
            if (payment.customer !== res.locals.user._id) {
                throw new AppError_utils_1.AppError("You are not authorized to view this payment", 401);
            }
            // Check if the payment is already done
            if (payment.status === "success") {
                throw new AppError_utils_1.AppError("Payment already done", 400);
            }
            // Check if the payment is done by razorpay
            const paymentDataString = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", Object(process.env).RAZORPAY_KEY_SECRET)
                .update(paymentDataString.toString())
                .digest("hex");
            if (razorpay_signature !== expectedSignature) {
                throw new AppError_utils_1.AppError("Payment not done by razorpay", 400);
            }
            // Update the payment object with the payment intent id
            payment.transaction_id = razorpay_payment_id;
            payment.status = "success";
            yield payment.save();
            // Update the project object with the payment id
            const project = (yield project_model_1.Project.findById(payment.project));
            project.due_amount -= payment.amount;
            yield project.save();
            return payment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.PaymentVerify = PaymentVerify;
// const sendPaymentResponse = (res: Response, payment: object) => {
//   return res.status(200).json({
//     status: "success",
//     payment,
//     paymentIntentResponse: undefined,
//   });
// };
