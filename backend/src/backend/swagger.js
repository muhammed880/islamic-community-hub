const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Islamic Community Hub API',
      version: '1.0.0',
      description: 'Complete API documentation for Islamic Community Hub Platform',
      contact: {
        name: 'Support',
        email: 'support@islamichub.com'
      },
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server'
      },
      {
        url: 'https://api.islamichub.com/api',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using Bearer scheme'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'ObjectId' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            role: { type: 'string', enum: ['general_user', 'masjid_authority', 'super_admin'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Masjid: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'ObjectId' },
            masjidName: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            upiId: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                latitude: { type: 'number' },
                longitude: { type: 'number' }
              }
            },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] }
          }
        },
        Donation: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'ObjectId' },
            amount: { type: 'number' },
            donationType: { type: 'string', enum: ['zakat', 'sadaqah', 'general'] },
            transactionStatus: { type: 'string', enum: ['pending_verification', 'completed', 'failed'] },
            upiTransactionId: { type: 'string' },
            donationDate: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      { BearerAuth: [] }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
