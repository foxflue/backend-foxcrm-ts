"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptedRandomString = exports.hashString = void 0;
const crypto_1 = __importDefault(require("crypto"));
const hashString = () => crypto_1.default.randomBytes(32).toString("hex");
exports.hashString = hashString;
const encryptedRandomString = (text) => crypto_1.default.createHash("sha256").update(text).digest("hex");
exports.encryptedRandomString = encryptedRandomString;
