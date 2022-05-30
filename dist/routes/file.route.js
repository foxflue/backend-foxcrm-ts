"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = __importDefault(require("./../controller/file.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const router = express_1.default.Router();
router
    .route("/file")
    .get([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], file_controller_1.default.index)
    .post([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], file_controller_1.default.store);
router
    .route("/file/:id")
    .delete([auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], file_controller_1.default.destroy);
// router.post(
//   "/file/get-signed-url",
//   [authMiddleware.checkLogin, authMiddleware.checkAdmin],
//   fileController.getSignedUrl
// );
exports.default = router;
