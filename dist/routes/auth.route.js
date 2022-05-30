"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import checkCaptcha from './../middleware/recaptcha.middleware';
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_schema_1 = require("../schema/auth.schema");
const auth_controller_1 = __importDefault(require("./../controller/auth.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const router = express_1.default.Router();
router.post("/auth/register", [(0, validate_middleware_1.validate)(auth_schema_1.userDetailsSchema), (0, validate_middleware_1.validate)(auth_schema_1.userPasswordSchema)], auth_controller_1.default.register); // captcha
router.post("/auth/login", auth_controller_1.default.login); // captcha
router.post("/auth/oauth-login/:id", auth_controller_1.default.socialLogin);
router.post("/auth/two-fa", [auth_middleware_1.default.checkLogin], auth_controller_1.default.set2FAMode);
router.post("/auth/two-fa-verify/:id/:otp", auth_controller_1.default.verify2FASecret);
router.get("/auth/user", [auth_middleware_1.default.checkLogin], auth_controller_1.default.me);
router.post("/auth/verify-email/:token", auth_controller_1.default.verifyEmail);
router.post("/auth/resend-verify-email", auth_controller_1.default.resendVerifyEmail);
router.post("/auth/forgot-password", 
//   [checkCaptcha],
auth_controller_1.default.forgotPassword);
router.post("/auth/reset-password/:token", [(0, validate_middleware_1.validate)(auth_schema_1.userPasswordSchema)], auth_controller_1.default.resetPassword);
router.post("/auth/password-change", [auth_middleware_1.default.checkLogin], [(0, validate_middleware_1.validate)(auth_schema_1.userPasswordSchema)], auth_controller_1.default.changePassword);
router.post("/auth/logout", auth_middleware_1.default.checkLogin, auth_controller_1.default.logout);
exports.default = router;
