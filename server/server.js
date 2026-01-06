const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectDB } = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Apartment Management API Docs',
}));

app.get('/', (req, res) => {
    res.send('API is running... Visit /api-docs for documentation');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/units', require('./routes/unitRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/parking', require('./routes/parkingRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
