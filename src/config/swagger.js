const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "MockAPI Pro API",
      version: "1.0.0",
      description:
        "Dynamic Mock API Platform Documentation"
    },

    servers: [
      {
        url: "http://localhost:5000"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ["./src/routes/**/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;