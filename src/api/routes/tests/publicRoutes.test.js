import express from "express";
import { expect } from "chai";
import supertest from "supertest";
import { publicCtrl } from "../../controllers/publicController";
import { errorHandler } from "../../utils/errorUtils";

const app = express();
app.use(express.json());
app.post("/login", publicCtrl.login);
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

const request = supertest(app);

describe("Public Routes", function async() {
  describe("Login Route - POST /login", function () {
    it("should return a token when username and password is passed", async function () {
      // create temp env var
      process.env.JWT_SECRET = "test_secret";
      const [username, password] = ["someUsername", "somePassword"];
      const response = await request
        .post("/login")
        .send({ username, password });
      expect(response.status).to.equal(200);
      expect(response.body.data.token).to.be.a("string");
    });

    it("should return an error (400) with invalid password", async function () {
      const [username] = ["someUserameWithoutPassword"];
      const response = await request.post("/login").send({ username });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("Validation Error");
    });

    it("should return an error (400) with invalid username", async function () {
      const [password] = ["passwordWithoutUsername"];
      const response = await request.post("/login").send({ password });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("Validation Error");
    });
  });
});
