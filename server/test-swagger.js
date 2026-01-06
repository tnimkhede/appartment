const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

console.log('Testing Swagger JSDoc...\n');
console.log('Current directory:', __dirname);
console.log('Docs path:', path.join(__dirname, '../docs/*.js'));
console.log('Routes path:', path.join(__dirname, '../routes/*.js'));

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Test API',
            version: '1.0.0',
        },
    },
    apis: [
        path.join(__dirname, 'docs/swagger-annotations.js'),
        path.join(__dirname, 'routes/*.js'),
    ],
};

const spec = swaggerJsdoc(options);

console.log('\nGenerated spec paths:', Object.keys(spec.paths || {}));
console.log('Total endpoints found:', Object.keys(spec.paths || {}).length);

if (Object.keys(spec.paths || {}).length === 0) {
    console.log('\n❌ No endpoints found! Check if JSDoc comments are correct.');
} else {
    console.log('\n✅ Endpoints found successfully!');
}
