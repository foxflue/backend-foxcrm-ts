"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const project_schema_1 = require("../schema/project.schema");
const project_controller_1 = __importDefault(require("./../controller/project.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const router = express_1.default.Router();
router
    .route("/project")
    .get([auth_middleware_1.default.checkLogin], project_controller_1.default.index)
    .post([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], (0, validate_middleware_1.validate)(project_schema_1.projectSchema), project_controller_1.default.store);
router
    .route("/project/:id")
    .get([auth_middleware_1.default.checkLogin], project_controller_1.default.show)
    .patch([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], project_controller_1.default.update)
    .delete([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], project_controller_1.default.destroy);
exports.default = router;
