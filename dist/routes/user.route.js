"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_schema_1 = require("../schema/auth.schema");
const user_controller_1 = __importDefault(require("./../controller/user.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const validate_middleware_1 = require("./../middleware/validate.middleware");
const router = express_1.default.Router();
router
    .route("/user")
    .get([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], user_controller_1.default.index)
    .post([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], [(0, validate_middleware_1.validate)(auth_schema_1.userDetailsSchema)], user_controller_1.default.store);
router.get("/user/dashboard", auth_middleware_1.default.checkLogin, user_controller_1.default.dashboard);
router
    .route("/user/:id")
    .get([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], user_controller_1.default.show)
    .delete([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], user_controller_1.default.destroy);
exports.default = router;
