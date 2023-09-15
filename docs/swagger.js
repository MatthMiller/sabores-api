import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    info: {
      title: 'RESTful Blog API',
      version: '1.0.0',
      description: 'Complete API for blog platform.',
    },
  },
  apis: ['./docs/*.js'],
};

const specs = swaggerJSDoc(options);

export default specs;
