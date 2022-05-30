"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mongoose_1 = require("mongoose");
const FileSchema = new mongoose_1.Schema({
    path: {
        type: String,
        required: [true, "Path is required"],
    },
}, {
    timestamps: {
        createdAt: "created_at",
    },
});
exports.File = (0, mongoose_1.model)("File", FileSchema);
