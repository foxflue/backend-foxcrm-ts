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
const catchAsync_utils_1 = __importDefault(require("../utils/catchAsync.utils"));
const organization_service_1 = require("./../service/organization.service");
const store = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(res.locals.user);
    const organization = yield (0, organization_service_1.CreateOrg)(res.locals.user, req.body);
    res.status(200).json({
        status: "success",
        data: organization,
    });
}));
const index = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const organizations = yield (0, organization_service_1.FetchAllOrg)(req.query);
    res.status(200).json({
        status: "success",
        results: organizations.length,
        data: organizations,
    });
}));
const show = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const organization = yield (0, organization_service_1.FetchOrg)(res.locals.user.organization);
    res.status(200).json({
        status: "success",
        data: organization,
    });
}));
const update = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, organization_service_1.UpdateOrg)(res.locals.user.organization, req.body);
    res.status(200).json({
        status: "success",
        message: "Updated!",
    });
}));
const destroy = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, organization_service_1.DeleteOrg)(req.params.id);
    res.status(200).json({
        status: "success",
        data: null,
    });
}));
exports.default = {
    store,
    index,
    show,
    update,
    destroy,
};
