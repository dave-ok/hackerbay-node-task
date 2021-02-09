import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swagger-spec";

const docsRouter = express.Router();

const swaggerUiOptions = {
  customSiteTitle: "HackerBay - Node API Task | API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
};

docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default docsRouter;
