const express = require('express');
const router = express.Router();
const {
    getDocuments,
    createDocument,
} = require('../controllers/documentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDocuments).post(protect, admin, createDocument);

module.exports = router;
