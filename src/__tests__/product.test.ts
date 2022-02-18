// import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import { app } from "./../app";
import { connectDB } from "./../db/connect.db";
import { disconnectDB } from "./../db/disconnect.db";
import jwtHelper from "./../utils/jwtHelper.utils";

const userPayload = {
  id: "620a6dae34f64e64a72cfe75",
  rememberme: true,
};

describe("Product", () => {
  beforeAll(async () => {
    connectDB();
  });

  describe("Get Product route", () => {
    describe("Given the product doesn't exist", () => {
      test("Should return a 401 ", async () => {
        const projectId = "project_20746";

        await supertest(app).get(`/api/v2/project/${projectId}`).expect(401);
      });

      test("Should return a 404", async () => {
        const projectId = "project_20746";
        const jwtToken = await jwtHelper.signToken(userPayload);

        await supertest(app)
          .get(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`)
          .expect(404);
      }, 10000);

      test("Should return a 200", async () => {
        const projectId = "61e8f90c05903f3bf820e5af";
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode, body } = await supertest(app)
          .get(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`);

        console.log(statusCode);
        console.log(body);
      }, 10000);
    });
  });

  afterAll(async () => {
    disconnectDB();
  });
});
