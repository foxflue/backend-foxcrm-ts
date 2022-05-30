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
exports.DeletePost = exports.UpdatePost = exports.FetchPost = exports.FetchAllPost = exports.CreatePost = void 0;
const post_model_1 = require("../model/post.model");
const apiFeture_utils_1 = __importDefault(require("../utils/apiFeture.utils"));
const AppError_utils_1 = require("../utils/AppError.utils");
const hook_1 = __importDefault(require("../utils/hook"));
const slugify_1 = require("../utils/slugify");
function CreatePost(id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            input.organization = id;
            input.slug = yield (0, slugify_1.slugify)(input.title);
            const post = yield post_model_1.Post.create(input);
            yield (0, hook_1.default)();
            return post;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.CreatePost = CreatePost;
function FetchAllPost(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new apiFeture_utils_1.default(post_model_1.Post.find().select("-content"), query)
                .filter()
                .sort()
                .limitFields()
                .paginate();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchAllPost = FetchAllPost;
function FetchPost(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield post_model_1.Post.findOne({ slug });
            if (!post) {
                throw new AppError_utils_1.AppError("No post found with that", 404);
            }
            return post;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.FetchPost = FetchPost;
function UpdatePost(id, slug, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (input.title) {
                input.slug = yield (0, slugify_1.slugify)(input.title);
            }
            const post = yield post_model_1.Post.findOneAndUpdate({ slug, organigation: id }, input);
            if (!post) {
                throw new AppError_utils_1.AppError("No post found with that slug", 404);
            }
            yield (0, hook_1.default)();
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.UpdatePost = UpdatePost;
function DeletePost(id, slug) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield post_model_1.Post.findOneAndDelete({ slug, organigation: id });
            if (!post) {
                throw new AppError_utils_1.AppError("No post found with that slug", 404);
            }
            yield (0, hook_1.default)();
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.DeletePost = DeletePost;
