import express from "express";
import { expect } from "chai";
import supertest from "supertest";
import { errorHandler } from "../../utils/errorUtils";
import { generateToken, makeRandomId } from "../../utils/authUtils";
import protectedRoutes from "../protectedRoutes";
import sharp from "sharp";

const nock = require("nock");

describe("Protected Routes - /utils", function () {
  let request, reusableToken, mockImage;

  before(async function () {
    //load enviroment variables
    require("dotenv").config();

    reusableToken = generateToken(makeRandomId(8));

    const app = express();
    app.use(express.json());
    app.use("/utils", protectedRoutes);
    app.use((err, req, res, next) => {
      errorHandler(err, req, res, next);
    });

    request = supertest(app);

    mockImage = await sharp({
      create: {
        width: 300,
        height: 200,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();
  });

  describe("/utils Route", function () {
    it("Unauthenticated request should return 401 error", async function () {
      const response = await request.get("/utils").send();
      expect(response.status).to.equal(401);
    });
  });

  describe("JSON Patch Request - POST /utils/json-patch", function () {
    it("should return patched JSON (status 200) given valid JSON and JSONPatch operator", async function () {
      const jsonObject = {
        biscuits: [{ name: "Digestive" }, { name: "Choco Leibniz" }],
      };
      const jsonPatch = [
        { op: "add", path: "/biscuits/1", value: { name: "Ginger Nut" } },
      ];

      const expectedObject = {
        biscuits: [
          { name: "Digestive" },
          { name: "Ginger Nut" },
          { name: "Choco Leibniz" },
        ],
      };

      const response = await request
        .post("/utils/json-patch")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ jsonObject, jsonPatch });

      expect(response.status).to.equal(200);
      expect(response.body.data.document).to.deep.equal(expectedObject);
    });

    it("should return an error (400) without JSON object", async function () {
      const jsonPatch = [
        { op: "add", path: "/biscuits/1", value: { name: "Ginger Nut" } },
      ];

      const response = await request
        .post("/utils/json-patch")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ jsonPatch });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("validation error");
    });

    it("should return an error (400) with invalid JSON object", async function () {
      const jsonPatch = [
        { op: "add", path: "/biscuits/1", value: { name: "Ginger Nut" } },
      ];

      const response = await request
        .post("/utils/json-patch")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ jsonPatch, jsonObject: "Some String" });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("validation error");
    });

    it("should return an error (400) without JSONPatch object", async function () {
      const jsonObject = {
        biscuits: [{ name: "Digestive" }, { name: "Choco Leibniz" }],
      };

      const response = await request
        .post("/utils/json-patch")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ jsonObject });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("validation error");
    });

    it("should return an error (400) with invalid JSONPatch object", async function () {
      const jsonObject = {
        biscuits: [{ name: "Digestive" }, { name: "Choco Leibniz" }],
      };

      const jsonPatch = [{ field: "Invalid JSON Patch operator" }];

      const response = await request
        .post("/utils/json-patch")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ jsonPatch, jsonObject });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("validation error");
    });

    it("should return an error (400) with patching error", async function () {
      const jsonObject = {
        biscuits: [{ name: "Digestive" }, { name: "Choco Leibniz" }],
      };

      const jsonPatch = [
        { op: "add", path: "/cakes/3", value: { name: "Ginger Nut" } },
      ];

      const response = await request
        .post("/utils/json-patch")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ jsonPatch, jsonObject });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("patching error");
    });
  });

  describe("Thumbnail Creation Request - POST /utils/create-thumbnail", function () {
    it("should return JSON body with base64 thumbnail image", async function () {
      const baseUrl = "https://mock-image-url.xyz";
      const imageUrl = "https://mock-image-url.xyz/image";

      // http intercept with nock
      nock(baseUrl).get("/image").reply(200, mockImage);

      const response = await request
        .post("/utils/create-thumbnail")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ imageUrl });

      expect(response.status).to.equal(200);
      expect(response.body.data.base64Thumbnail).to.be.a("string");
    });

    it("should return raw thumbnail image with query parameter '?raw=true'", async function () {
      const baseUrl = "https://mock-image-url.xyz";
      const imageUrl = "https://mock-image-url.xyz/image";

      // http intercept with nock
      nock(baseUrl).get("/image").reply(200, mockImage);

      const response = await request
        .post("/utils/create-thumbnail?raw=true")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ imageUrl });

      expect(response.status).to.equal(200);
      expect(Buffer.isBuffer(response.body)).true;
    });

    it("should return an error (400) with invalid url", async function () {
      const imageUrl = "httpx//invalid-url/image";

      const response = await request
        .post("/utils/create-thumbnail")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ imageUrl });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("validation error");
    });

    it("should return an error (400) with non-existent url", async function () {
      const imageUrl = "http://non-existent-url.com/image";

      const response = await request
        .post("/utils/create-thumbnail")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ imageUrl });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("Error fetching image");
    });

    it("should return an error (400) with invalid image", async function () {
      const baseUrl = "https://mock-image-url.xyz";
      const imageUrl = "https://mock-image-url.xyz/bad-image";

      // create mock text buffer
      const buffer = Buffer.from("a".repeat(10240));

      nock(baseUrl).get("/bad-image").reply(200, buffer);

      const response = await request
        .post("/utils/create-thumbnail")
        .set("Authorization", `bearer ${reusableToken}`)
        .send({ imageUrl });

      expect(response.status).to.equal(400);
      expect(response.body.error).to.contain("Error creating thumbnail");
    });
  });
});
