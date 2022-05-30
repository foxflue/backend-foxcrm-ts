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
const lead_service_1 = require("../service/lead.service");
const catchAsync_utils_1 = __importDefault(require("./../utils/catchAsync.utils"));
const emailHandler_utils_1 = __importDefault(require("./../utils/emailHandler.utils"));
const index = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const leads = yield (0, lead_service_1.FeatchAllLead)(req.query);
    res.status(200).json({
        status: "success",
        result: leads.length,
        data: leads,
    });
}));
const store = (0, catchAsync_utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lead = yield (0, lead_service_1.CreateLead)(req.body);
    if (lead) {
        yield emailHandler_utils_1.default.sendEmail({
            email: "hello@foxflue.com",
            subject: "New Lead",
            body: `
        Name: ${lead.name}
        Email: ${lead.email}
        Message: ${lead.message}
        Purpose: ${Object(lead.meta).purpose}
      `,
        });
    }
    res.status(201).json({
        status: "success",
    });
}));
exports.default = {
    index,
    store,
};
