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
// import { MongoMemoryServer } from "mongodb-memory-server";
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const connect_db_1 = require("../db/connect.db");
const disconnect_db_1 = require("../db/disconnect.db");
const jwtHelper_utils_1 = __importDefault(require("../utils/jwtHelper.utils"));
const userPayload = {
    id: "620a6dae34f64e64a72cfe75",
    rememberme: true,
};
const projectPayload = {
    title: "Tradelia",
    content: "Gorcery sell on online",
    entities: ["selling", "Delivery", "Payment"],
    price: 90.9,
};
const updatePayload = {
    title: "Hifixer",
};
describe("Project", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, connect_db_1.connectDB)();
    }));
    // 1) POST PROJECT API TEST
    describe("Post Project route", () => {
        describe("Unauthorized user", () => {
            test("Should return 401", () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .post(`/api/v2/project`)
                    .send(projectPayload);
                expect(statusCode).toBe(401);
            }));
        });
        describe("Authorized User", () => {
            test("Should return 201", () => __awaiter(void 0, void 0, void 0, function* () {
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode, body } = yield (0, supertest_1.default)(app_1.app)
                    .post("/api/v2/project")
                    .set("Authorization", `Bearer ${jwtToken}`)
                    .send(projectPayload);
                expect(statusCode).toBe(201);
            }));
        });
    });
    // 2) GET PROJECTS  API TEST
    describe("Get Project route ", () => {
        describe("UnAuthorized User", () => {
            test("Should return 401", () => __awaiter(void 0, void 0, void 0, function* () {
                const { statusCode } = yield (0, supertest_1.default)(app_1.app).get(`/api/v2/project`);
                expect(statusCode).toBe(401);
            }));
        });
        describe("Authorized User", () => {
            test("Should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .get(`/api/v2/project`)
                    .set("Authorization", `Bearer ${jwtToken}`);
                expect(statusCode).toBe(200);
            }));
        });
    });
    // 3) GET PROJECT  API TEST
    describe("Get Project route", () => {
        describe("Given the Project doesn't exist", () => {
            test("Should return a 401 ", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "project_20746";
                yield (0, supertest_1.default)(app_1.app).get(`/api/v2/project/${projectId}`).expect(401);
            }));
            test("Should return a 404", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5ca";
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .get(`/api/v2/project/${projectId}`)
                    .set("Authorization", `Bearer ${jwtToken}`);
                expect(statusCode).toBe(404);
            }));
            test("Should return a 200", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5af";
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode, body } = yield (0, supertest_1.default)(app_1.app)
                    .get(`/api/v2/project/${projectId}`)
                    .set("Authorization", `Bearer ${jwtToken}`);
                console.log(statusCode);
                console.log(body);
            }));
        });
    });
    // 4) UPDATE PROJECT API TEST
    describe("Update Project route", () => {
        describe("Unauthorized user", () => {
            test("Should return 401", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5af";
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .patch(`/api/v2/project/${projectId}`)
                    .send(updatePayload);
                expect(statusCode).toBe(401);
            }));
        });
        describe("Authorized User", () => {
            test("Should return 404", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5ay";
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .patch(`/api/v2/project/${projectId}`)
                    .set("Authorization", `Bearer ${jwtToken}`)
                    .send(updatePayload);
                expect(statusCode).toBe(404);
            }));
            test("Should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5af";
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .patch(`/api/v2/project/${projectId}`)
                    .set("Authorization", `Bearer ${jwtToken}`)
                    .send(updatePayload);
                expect(statusCode).toBe(200);
            }));
        });
    });
    //  5) DELETE PROJECT API TEST
    describe.only("Delete Project route", () => {
        describe("Unauthorized user", () => {
            test("Should return 401", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5af";
                const { statusCode } = yield (0, supertest_1.default)(app_1.app).delete(`/api/v2/project/${projectId}`);
                expect(statusCode).toBe(401);
            }));
        });
        describe("Authorized User", () => {
            test("Should return 404", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5ay";
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .delete(`/api/v2/project/${projectId}`)
                    .set("Authorization", `Bearer ${jwtToken}`);
                expect(statusCode).toBe(404);
            }));
            test("Should return 200", () => __awaiter(void 0, void 0, void 0, function* () {
                const projectId = "61e8f90c05903f3bf820e5af";
                const jwtToken = yield jwtHelper_utils_1.default.signToken(userPayload);
                const { statusCode } = yield (0, supertest_1.default)(app_1.app)
                    .delete(`/api/v2/project/${projectId}`)
                    .set("Authorization", `Bearer ${jwtToken}`);
                expect(statusCode).toBe(200);
            }));
        });
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        (0, disconnect_db_1.disconnectDB)();
    }));
});
