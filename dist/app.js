"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const auth_service_1 = require("./../src/service/auth.service");
const _404_error_1 = __importDefault(require("./common/404.error"));
const error_controller_1 = require("./common/error.controller");
const connect_db_1 = require("./db/connect.db");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const file_route_1 = __importDefault(require("./routes/file.route"));
const lead_route_1 = __importDefault(require("./routes/lead.route"));
const organization_route_1 = __importDefault(require("./routes/organization.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
dotenv.config();
exports.app = (0, express_1.default)();
const PORT = Object(process.env).PORT;
const HOST = Object(process.env).HOST;
// Connect MongoDB
(0, connect_db_1.connectDB)();
exports.app.use(express_1.default.json());
node_cron_1.default.schedule("01 0 0 * * *", () => {
    (0, auth_service_1.DeleteFakeAccount)();
});
exports.app.use("/api/v2", auth_route_1.default);
exports.app.use("/api/v2", user_route_1.default);
exports.app.use("/api/v2", project_route_1.default);
exports.app.use("/api/v2", post_route_1.default);
exports.app.use("/api/v2", lead_route_1.default);
exports.app.use("/api/v2", file_route_1.default);
exports.app.use("/api/v2", dashboard_route_1.default);
exports.app.use("/api/v2", payment_route_1.default);
exports.app.use("/api/v2", organization_route_1.default);
exports.app.use(error_controller_1.globalErrorHandler);
exports.app.use(_404_error_1.default);
exports.app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
