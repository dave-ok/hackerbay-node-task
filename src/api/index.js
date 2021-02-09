import express from "express";
import cors from "cors";
import publicRoutes from "./routes/publicRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import { CustomError, errorHandler } from "./utils/errorUtils";
import { jsonResponse } from "./utils/responseUtils";
import docsRouter from "./routes/docsRoute";

// create express app
const app = express();

// set up CORS
app.use(cors());

// include middleware to enable json body parsing and nested objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/login", publicRoutes);
app.use("/utils", protectedRoutes);
app.use("/docs", docsRouter);

// base route
app.get("/", (req, res) => {
  return jsonResponse(res, 200, undefined, "Server is up and running");
});

// routes not found go here
app.all("*", (req, res, next) => {
  const error = new CustomError(404, "Oops! Resource not found");
  next(error);
});

// default error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default app;
