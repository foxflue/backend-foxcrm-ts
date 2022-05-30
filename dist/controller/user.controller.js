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
const lodash_1 = require("lodash");
const auth_service_1 = require("../service/auth.service");
const user_service_1 = require("../service/user.service");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const index = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, user_service_1.FetchAll)(res.locals.user.organization, req.query);
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    });
}));
const store = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.organization = res.locals.user.organization;
    yield (0, auth_service_1.createUser)(req.body);
    res.status(201).json({
        status: "success",
        message: "User has been added",
    });
}));
const show = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.FetchOne)(res.locals.user.organization, req.params.id);
    res.status(200).json({
        status: "success",
        data: (0, lodash_1.omit)(user.toJSON(), "password"),
    });
}));
const destroy = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_service_1.RemoveOne)(res.locals.user.organization, req.params.id);
    res.status(204).json({
        status: "success",
        data: "Removed.",
    });
}));
const dashboard = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { projects, payments } = yield (0, user_service_1.Dashboard)(res.locals.user._id);
    res.status(200).json({
        status: "success",
        data: {
            projects,
            payments,
        },
    });
}));
exports.default = {
    index,
    store,
    show,
    destroy,
    dashboard,
};
