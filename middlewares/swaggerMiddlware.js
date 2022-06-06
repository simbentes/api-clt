const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Articles app',
    version: '1.0.0',
    description: 'Articles app made with express.js.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  url: 'http://localhost:3000/docs/swagger.json',
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = [swaggerUi.serve, swaggerUi.setup(swaggerSpec)];
