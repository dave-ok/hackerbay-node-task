import express from "express";
const expressJWT = require("express-jwt");

require("dotenv").config();

const jwtMW = expressJWT({
  secret: Buffer.from(process.env.JWT_SECRET, "base64"),
  requestProperty: "token",
  algorithms: ["HS256"],
});

const protectedRoutes = express.Router();

// protect following routes with jwt middleware
protectedRoutes.use(jwtMW);
protectedRoutes.get("/", (req, res) => res.send("Passed"));

export default protectedRoutes;
