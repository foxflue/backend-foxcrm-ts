"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = __importDefault(require("../controller/dashboard.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
router.get("/stats", [auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], dashboard_controller_1.default.getStats);
exports.default = router;
