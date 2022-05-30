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
exports.forgotPasswordEmailContent = void 0;
const template_1 = __importDefault(require("./../view/email/template"));
const forgotPasswordEmailContent = (name, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    let emailContent = template_1.default.replace("{{name}}", name);
    emailContent = emailContent.replace("{{body}}", "You have requested to reset your password. Please click on the link below to reset your password");
    emailContent = emailContent.replace("{{link}}", `${process.env.FRONTEND}/auth/reset-password/${verificationToken}`);
    emailContent = emailContent.replace("{{btnLabel}}", "Reset Password");
    emailContent = emailContent.replace("{{footerText}}", "if you didn't request to reset your password then ignore this email.");
    return emailContent;
});
exports.forgotPasswordEmailContent = forgotPasswordEmailContent;
