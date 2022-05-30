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
const payment_service_1 = require("../service/payment.service");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const index = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield (0, payment_service_1.FetchAllPayment)(req.query);
    res.status(200).json({
        status: "success",
        results: payments.length,
        data: payments,
    });
}));
const store = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield (0, payment_service_1.CreatePayment)(req.body);
    res.status(201).json({
        status: "success",
        data: payment,
    });
}));
const show = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { payment, paymentIntentResponse } = yield (0, payment_service_1.FetchPayment)(req.params.id, res);
    res.status(201).json({
        status: "success",
        data: {
            payment,
            paymentIntentResponse,
        },
    });
}));
const verifyPayment = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield (0, payment_service_1.PaymentVerify)({
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
}));
exports.default = {
    index,
    show,
    store,
    verifyPayment,
};
