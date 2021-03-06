"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BackupSchema = new mongoose_1.default.Schema({
    path: {
        type: String,
        required: [true, "Path is required"],
    },
}, {
    timestamps: {
        createdAt: "created_at",
    },
});
const Backup = mongoose_1.default.model("Backup", BackupSchema);
exports.default = Backup;
