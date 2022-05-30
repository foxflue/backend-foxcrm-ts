"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_schema_1 = require("../schema/post.schema");
const post_controller_1 = __importDefault(require("./../controller/post.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const validate_middleware_1 = require("./../middleware/validate.middleware");
const router = express_1.default.Router();
router
    .route("/post")
    .get(post_controller_1.default.index)
    .post([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], (0, validate_middleware_1.validate)(post_schema_1.postSchema), post_controller_1.default.store);
router
    .route("/post/:slug")
    .get(post_controller_1.default.show)
    .patch([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], post_controller_1.default.update)
    .delete([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], post_controller_1.default.destroy);
exports.default = router;
