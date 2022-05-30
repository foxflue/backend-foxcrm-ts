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
const forgotPassword_emailContent_1 = require("../emailContent/forgotPassword.emailContent");
const auth_registered_emailContent_1 = require("./../emailContent/auth.registered.emailContent");
const login_emailContent_1 = require("./../emailContent/login.emailContent");
const auth_service_1 = require("./../service/auth.service");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const emailHandler_utils_1 = __importDefault(require("./../utils/emailHandler.utils"));
const login = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, token, secretToken } = yield (0, auth_service_1.LoginUser)({
        email: req.body.email,
        password: req.body.password,
        rememberme: req.body.rememberme,
    });
    if (secretToken) {
        yield emailHandler_utils_1.default.sendEmail({
            email: user.email,
            subject: "Login",
            body: yield (0, login_emailContent_1.loginEmailContent)(user.name, secretToken),
        });
        return res.status(200).json({
            id: user._id,
            message: "Check your email.",
        });
    }
    // User response with token and user data
    res.status(200).json({
        status: "success",
        accessToken: token,
        data: user,
        secretToken: secretToken,
    });
}));
const register = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // User Create
    const { user, verificationToken } = yield (0, auth_service_1.createUser)(req.body);
    // Send Greetings Email
    yield emailHandler_utils_1.default.sendEmail({
        email: user.email,
        subject: "Welcome to Foxflue",
        body: yield (0, auth_registered_emailContent_1.authRegisteredEmail)(user.name, verificationToken),
    });
    // Response
    res.status(201).json({
        status: "success",
        message: "Please verify your email.",
    });
}));
const me = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        data: res.locals.user,
    });
}));
const logout = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        message: "User has been logged out from the application",
    });
}));
const verifyEmail = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.UserEmailVerification)(req.params.token);
    res.status(200).json({
        status: "success",
        message: "Your email has been verified",
    });
}));
const resendVerifyEmail = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, verificationToken } = yield (0, auth_service_1.ResendEmailForVerify)(req.body);
    // Send Greetings Email
    yield emailHandler_utils_1.default.sendEmail({
        email: user.email,
        subject: "Welcome to Foxflue",
        body: yield (0, auth_registered_emailContent_1.authRegisteredEmail)(user.name, verificationToken),
    });
    // Response
    res.status(201).json({
        status: "success",
        message: "Check you email.",
    });
}));
const forgotPassword = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, verificationToken } = yield (0, auth_service_1.UserForgotPassword)({
        email: req.body.email,
    });
    // Send Verification Email
    yield emailHandler_utils_1.default.sendEmail({
        email: user.email,
        subject: "Reset Password",
        body: yield (0, forgotPassword_emailContent_1.forgotPasswordEmailContent)(user.name, verificationToken),
    });
    res.status(200).json({
        status: "success",
        message: "A verification email has been sent to the registered email",
    });
}));
const resetPassword = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.UserResetPassword)({
        token: req.params.token,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    res.status(200).json({
        status: "success",
        message: "Password has been updated",
    });
}));
const changePassword = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.UpdatePassword)({
        id: res.locals.user._id,
        oldPassword: req.body.oldPassword,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    res.status(200).json({
        status: "success",
        message: "Password has been updated",
    });
}));
const socialLogin = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = yield (0, auth_service_1.OAuthLogin)({
        id: req.params.id,
        code: req.body.code,
        client_id: req.body.client_id,
        redirect_uri: req.body.redirect_uri,
    });
    res.status(200).json(access_token);
}));
const set2FAMode = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.SetTwoFA)({
        id: res.locals.user.id,
        mode: req.body.mode,
    });
    res
        .status(200)
        .json(`Now Your 2FA mode has turn ${req.body.mode ? "on" : "off"}.`);
}));
const verify2FASecret = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, token } = yield (0, auth_service_1.VerifySecret)(req.params.id, req.params.otp);
    // send responce
    res.status(200).json({
        status: "success",
        accessToken: token,
        user: user,
    });
}));
exports.default = {
    login,
    register,
    me,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerifyEmail,
    changePassword,
    socialLogin,
    set2FAMode,
    verify2FASecret,
};
