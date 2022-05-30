"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Project is required"],
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer is required"],
    },
    gateway: {
        type: Object,
    },
    transaction_id: {
        type: String,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be greater than 0"],
    },
    currency: {
        type: String,
        enum: ["USD", "INR"],
        default: "INR",
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
exports.Payment = (0, mongoose_1.model)("Payment", PaymentSchema);
