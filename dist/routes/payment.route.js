"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = __importDefault(require("./../controller/payment.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const router = express_1.default.Router();
router
    .route("/payment")
    .get(payment_controller_1.default.index)
    .post(auth_middleware_1.default.checkLogin, payment_controller_1.default.store);
router
    .route("/payment/:id")
    .get([auth_middleware_1.default.checkLogin], payment_controller_1.default.show);
router.post("/payment/verify/:id", auth_middleware_1.default.checkLogin, payment_controller_1.default.verifyPayment);
exports.default = router;
