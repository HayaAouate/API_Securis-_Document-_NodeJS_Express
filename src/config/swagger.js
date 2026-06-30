const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillHub API',
      version: '1.0.0',
      description: 'API de gestion pour la plateforme SkillHub. Épreuve EC04.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // On cherchera les annotations dans les fichiers de route
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
