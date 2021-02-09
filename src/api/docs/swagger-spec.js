import swaggerJSDoc from "swagger-jsdoc";

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.21", // Version of swagger
  info: {
    title: "HackerBay Node API Task", // Title of the documentation
    version: "1.0.0", // Version of the app
    description: "Node REST API providing utilities for JSON patching and thumbnail generation",
  },
  components: {
    securitySchemes: {
      Bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["src/api/docs/**/*.yml"],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
