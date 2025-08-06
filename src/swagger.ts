import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LiaPlusAI Blog API',
      version: '1.0.0',
      description: 'A RESTful API for a blog system with RBAC (Role-Based Access Control)',
      contact: {
        name: 'API Support',
        email: 'support@liaplusai.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3005',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            is_verified: {
              type: 'boolean',
              description: 'Email verification status'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Post ID'
            },
            title: {
              type: 'string',
              description: 'Post title'
            },
            content: {
              type: 'string',
              description: 'Post content'
            },
            author_id: {
              type: 'string',
              description: 'Author ID'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            password: {
              type: 'string',
              description: 'Password (min 8 chars, 1 capital, 1 number)'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role'
            }
          }
        },
        CreatePostRequest: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            title: {
              type: 'string',
              description: 'Post title'
            },
            content: {
              type: 'string',
              description: 'Post content'
            }
          }
        },
        UpdatePostRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Post title'
            },
            content: {
              type: 'string',
              description: 'Post content'
            }
          }
        }
      }
    }
  },
  apis: ['./src/controllers/*.ts', './src/routes.ts']
};

export const specs = swaggerJsdoc(options); 