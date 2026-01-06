const express = require('express');
const router = express.Router();
const {
    getVisitors,
    checkInVisitor,
    checkOutVisitor,
    updateVisitor,
    deleteVisitor,
} = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVisitors);
router.post('/checkin', protect, checkInVisitor);
router.put('/:id/checkout', protect, checkOutVisitor);
router
    .route('/:id')
    .put(protect, updateVisitor)
    .delete(protect, deleteVisitor);

module.exports = router;
