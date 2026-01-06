const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Test',
            version: '1.0.0',
        },
    },
    apis: [
        path.join(__dirname, 'docs/swagger-annotations.js'),
    ],
};

const spec = swaggerJsdoc(options);

console.log('Total paths found:', Object.keys(spec.paths || {}).length);
console.log('\nUser-related paths:');
Object.keys(spec.paths || {}).filter(p => p.includes('/users')).forEach(p => {
    console.log(`  ${p}:`, Object.keys(spec.paths[p]));
});

console.log('\nAll paths:');
Object.keys(spec.paths || {}).forEach(p => {
    console.log(`  ${p}:`, Object.keys(spec.paths[p]));
});
