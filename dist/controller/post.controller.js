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
const post_service_1 = require("../service/post.service");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const index = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield (0, post_service_1.FetchAllPost)(req.query);
    res.status(200).json({
        status: "success",
        results: posts.length,
        data: posts,
    });
}));
const store = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield (0, post_service_1.CreatePost)(res.locals.user.organization, req.body);
    res.status(201).json({
        status: "success",
        data: post,
    });
}));
const show = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield (0, post_service_1.FetchPost)(req.params.slug);
    res.status(200).json({
        status: "success",
        data: post,
    });
}));
const update = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield (0, post_service_1.UpdatePost)(res.locals.user.organization, req.params.slug, req.body);
    res.status(200).json({
        status: "success",
        message: "Updated.",
    });
}));
const destroy = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, post_service_1.DeletePost)(res.locals.user.organization, req.params.slug);
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.default = {
    index,
    store,
    show,
    update,
    destroy,
};
