"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_controller_1 = __importDefault(require("../controller/organization.controller"));
const auth_middleware_1 = __importDefault(require("./../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/org-create", [auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], organization_controller_1.default.store);
router.get("/org-index", [auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkSuperAdmin], organization_controller_1.default.index);
router.get("/org-show", [auth_middleware_1.default.checkLogin], organization_controller_1.default.show);
router.patch("/org-update", [auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkAdmin], organization_controller_1.default.update);
router.delete("/org-destroy/:id", [auth_middleware_1.default.checkLogin, auth_middleware_1.default.checkSuperAdmin], organization_controller_1.default.destroy);
exports.default = router;
