"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const LeadSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
    meta: {
        purpose: String,
    },
}, {
    timestamps: {
        createdAt: "created_at",
    },
});
exports.Lead = (0, mongoose_1.model)("Lead", LeadSchema);
