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
const user_model_1 = require("./../model/user.model");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const jwtHelper_utils_1 = __importDefault(require("./../utils/jwtHelper.utils"));
// Login required middleware
const checkLogin = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwtHelper_utils_1.default.extractToken(req);
    if (!token) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized request 💀",
        });
    }
    const decoded = jwtHelper_utils_1.default.verifyToken(token);
    const userId = Object(decoded).id;
    if (!userId) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized Request",
        });
    }
    const user = (yield user_model_1.User.findById(userId));
    if (user.verification_token) {
        return res.status(401).json({
            status: "fail",
            message: "Please verify your email",
        });
    }
    if (!user) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized Request",
        });
    }
    res.locals.user = user;
    next();
}));
const checkSuperAdmin = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user.roles;
    if (!user.includes("superadmin")) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized Request",
        });
    }
    next();
}));
const checkAdmin = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user.roles;
    if (!user.includes("admin")) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized Request",
        });
    }
    next();
}));
const checkManager = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user.roles;
    if (!user.includes("manager")) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized Request",
        });
    }
    next();
}));
const checkEmployee = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user.roles;
    if (!user.includes("employee")) {
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized Request",
        });
    }
    next();
}));
exports.default = {
    checkLogin,
    checkSuperAdmin,
    checkAdmin,
    checkManager,
    checkEmployee,
};
