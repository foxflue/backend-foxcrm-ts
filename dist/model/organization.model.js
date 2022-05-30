"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const mongoose_1 = require("mongoose");
const organizationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    about: {
        type: String,
    },
    image: {
        type: String,
    },
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Organization = (0, mongoose_1.model)("Organization", organizationSchema);
