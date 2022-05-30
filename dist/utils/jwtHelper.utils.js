"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const extractToken = (req) => {
    let token = req.header("authorization");
    if (!token) {
        return false;
    }
    token = token.split(" ")[1];
    return token;
};
const verifyToken = (token) => jsonwebtoken_1.default.verify(token, Object(process.env).JWT_SECRET_KEY);
const signToken = (args) => {
    return jsonwebtoken_1.default.sign({ id: Object(args).id }, Object(process.env).JWT_SECRET_KEY, {
        expiresIn: Object(args).rememberme ? "7d" : "1d",
    });
};
exports.default = { extractToken, verifyToken, signToken };
