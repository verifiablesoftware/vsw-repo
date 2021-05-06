const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "VSW Repo Controller API",
      version: "0.0.1"
    }
  },
  apis: ['admin.js', 'controller.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = {
  swaggerUI,
  swaggerDocs
};