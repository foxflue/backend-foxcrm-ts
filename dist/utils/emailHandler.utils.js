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
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: Object(process.env).NODEMAILER_HOST,
        port: Object(process.env).NODEMAILER_PORT,
        auth: {
            user: Object(process.env).NODEMAILER_USER,
            pass: Object(process.env).NODEMAILER_PASS,
        },
    });
    const emailOptions = {
        from: `"${Object(process.env).NODEMAILER_FROM}"< ${Object(process.env).NODEMAILER_EMAIL}>`,
        to: Object(options).email,
        subject: Object(options).subject,
        html: `${Object(options).body}`,
    };
    return transporter.sendMail(emailOptions);
});
exports.default = { sendEmail };
