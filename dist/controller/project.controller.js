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
const project_service_1 = require("../service/project.service");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const index = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield (0, project_service_1.FetchAllProject)(res.locals.user.organization, req.query);
    res.status(200).json({
        status: "success",
        results: projects.length,
        data: projects,
    });
}));
const store = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield (0, project_service_1.CreateProject)(res.locals.user, req.body);
    res.status(201).json({
        status: "success",
        data: project,
    });
}));
const show = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield (0, project_service_1.FetchProject)(res.locals.user.organization, req.params.id);
    res.status(200).json({
        status: "success",
        data: project,
    });
}));
const update = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield (0, project_service_1.UpdateProject)(res.locals.user.organization, req.params.id, req.body);
    res.status(200).json({
        status: "success",
        data: project,
    });
}));
const destroy = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, project_service_1.DeleteProject)(res.locals.user.organization, req.params.id);
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.default = {
    index,
    show,
    store,
    update,
    destroy,
};
