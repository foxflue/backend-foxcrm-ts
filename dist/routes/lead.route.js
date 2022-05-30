"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import checkCaptcha from "../middleware/recaptcha.middleware";
const validate_middleware_1 = require("../middleware/validate.middleware");
const lead_schema_1 = require("../schema/lead.schema");
const lead_controller_1 = __importDefault(require("./../controller/lead.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const router = express_1.default.Router();
router
    .route("/lead")
    .get([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], lead_controller_1.default.index)
    .post(
//   [checkCaptcha],
(0, validate_middleware_1.validate)(lead_schema_1.leadSchema), lead_controller_1.default.store);
exports.default = router;
