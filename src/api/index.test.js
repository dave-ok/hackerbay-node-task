import { expect } from "chai";
import supertest from "supertest";
import app from ".";

const request = supertest(app);

describe("Main Express Application", function () {
  it("GET / - should return default server status message", async function () {
    const response = await request.get("/");
    expect(response.status).to.equal(200);
    expect(response.body.message).to.contain("Server is up and running");
  });
  it("GET /invalid-route - should return error message", async function () {
    const response = await request.get("/invalid-route");
    expect(response.body.error).to.contain("Resource not found");
    expect(response.status).to.equal(404);
  });
});
