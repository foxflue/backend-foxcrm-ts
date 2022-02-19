// import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import { app } from "../app";
import { connectDB } from "../db/connect.db";
import { disconnectDB } from "../db/disconnect.db";
import jwtHelper from "../utils/jwtHelper.utils";

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
  beforeAll(async () => {
    connectDB();
  });

  // 1) POST PROJECT API TEST
  describe("Post Project route", () => {
    describe("Unauthorized user", () => {
      test("Should return 401", async () => {
        const { statusCode } = await supertest(app)
          .post(`/api/v2/project`)
          .send(projectPayload);

        expect(statusCode).toBe(401);
      });
    });

    describe("Authorized User", () => {
      test("Should return 201", async () => {
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/v2/project")
          .set("Authorization", `Bearer ${jwtToken}`)
          .send(projectPayload);

        expect(statusCode).toBe(201);
      });
    });
  });

  // 2) GET PROJECTS  API TEST
  describe("Get Project route ", () => {
    describe("UnAuthorized User", () => {
      test("Should return 401", async () => {
        const { statusCode } = await supertest(app).get(`/api/v2/project`);

        expect(statusCode).toBe(401);
      });
    });

    describe("Authorized User", () => {
      test("Should return 200", async () => {
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode } = await supertest(app)
          .get(`/api/v2/project`)
          .set("Authorization", `Bearer ${jwtToken}`);

        expect(statusCode).toBe(200);
      });
    });
  });

  // 3) GET PROJECT  API TEST
  describe("Get Project route", () => {
    describe("Given the Project doesn't exist", () => {
      test("Should return a 401 ", async () => {
        const projectId = "project_20746";

        await supertest(app).get(`/api/v2/project/${projectId}`).expect(401);
      });

      test("Should return a 404", async () => {
        const projectId = "61e8f90c05903f3bf820e5ca";
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode } = await supertest(app)
          .get(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`);

        expect(statusCode).toBe(404);
      });

      test("Should return a 200", async () => {
        const projectId = "61e8f90c05903f3bf820e5af";
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode, body } = await supertest(app)
          .get(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`);

        console.log(statusCode);
        console.log(body);
      });
    });
  });

  // 4) UPDATE PROJECT API TEST
  describe("Update Project route", () => {
    describe("Unauthorized user", () => {
      test("Should return 401", async () => {
        const projectId = "61e8f90c05903f3bf820e5af";
        const { statusCode } = await supertest(app)
          .patch(`/api/v2/project/${projectId}`)
          .send(updatePayload);

        expect(statusCode).toBe(401);
      });
    });

    describe("Authorized User", () => {
      test("Should return 404", async () => {
        const projectId = "61e8f90c05903f3bf820e5ay";
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode } = await supertest(app)
          .patch(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`)
          .send(updatePayload);

        expect(statusCode).toBe(404);
      });

      test("Should return 200", async () => {
        const projectId = "61e8f90c05903f3bf820e5af";
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode } = await supertest(app)
          .patch(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`)
          .send(updatePayload);

        expect(statusCode).toBe(200);
      });
    });
  });

  //  5) DELETE PROJECT API TEST
  describe.only("Delete Project route", () => {
    describe("Unauthorized user", () => {
      test("Should return 401", async () => {
        const projectId = "61e8f90c05903f3bf820e5af";
        const { statusCode } = await supertest(app).delete(
          `/api/v2/project/${projectId}`
        );

        expect(statusCode).toBe(401);
      });
    });

    describe("Authorized User", () => {
      test("Should return 404", async () => {
        const projectId = "61e8f90c05903f3bf820e5ay";
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode } = await supertest(app)
          .delete(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`);

        expect(statusCode).toBe(404);
      });

      test("Should return 200", async () => {
        const projectId = "61e8f90c05903f3bf820e5af";
        const jwtToken = await jwtHelper.signToken(userPayload);

        const { statusCode } = await supertest(app)
          .delete(`/api/v2/project/${projectId}`)
          .set("Authorization", `Bearer ${jwtToken}`);

        expect(statusCode).toBe(200);
      });
    });
  });

  afterAll(async () => {
    disconnectDB();
  });
});
