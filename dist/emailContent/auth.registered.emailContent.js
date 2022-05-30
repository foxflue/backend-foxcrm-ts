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
exports.authRegisteredEmail = void 0;
const template_1 = __importDefault(require("../view/email/template"));
const authRegisteredEmail = (name, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    let emailContent = template_1.default.replace("{{name}}", name);
    emailContent = emailContent.replace("{{body}}", "Your Foxflue CRM account has been created. Now nothing can stop you from taking your business online");
    emailContent = emailContent.replace("{{link}}", `${Object(process.env).FRONTEND}/auth/verify-email/${verificationToken}`);
    emailContent = emailContent.replace("{{btnLabel}}", "Verify your email");
    emailContent = emailContent.replace("{{footerText}}", "if you didn't create the account then ignore this email.");
    return emailContent;
});
exports.authRegisteredEmail = authRegisteredEmail;
