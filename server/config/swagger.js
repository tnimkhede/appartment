const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Apartment Management API',
            version: '1.0.0',
            description: 'Complete REST API for apartment/society management system with authentication, user management, tickets, bills, facilities, and more.',
            contact: {
                name: 'API Support',
                email: 'admin@apt.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
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
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['resident', 'management', 'security', 'maintenance'] },
                        unitNumber: { type: 'string' },
                        phone: { type: 'string' },
                        avatar: { type: 'string' },
                    },
                },
                Unit: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        number: { type: 'string' },
                        block: { type: 'string' },
                        floor: { type: 'integer' },
                        type: { type: 'string' },
                        familyMembers: { type: 'array', items: { type: 'object' } },
                        pets: { type: 'array', items: { type: 'object' } },
                        vehicles: { type: 'array', items: { type: 'object' } },
                    },
                },
                Ticket: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        category: { type: 'string', enum: ['plumbing', 'electrical', 'cleaning', 'elevator', 'security', 'other'] },
                        subject: { type: 'string' },
                        description: { type: 'string' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                        status: { type: 'string', enum: ['open', 'in-progress', 'resolved'] },
                    },
                },
                Bill: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        type: { type: 'string', enum: ['maintenance', 'water', 'gas', 'common'] },
                        amount: { type: 'number' },
                        dueDate: { type: 'string', format: 'date' },
                        status: { type: 'string', enum: ['paid', 'pending', 'overdue'] },
                        month: { type: 'string' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        path.join(__dirname, '../docs/swagger-annotations.js'),
        path.join(__dirname, '../routes/*.js'),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
