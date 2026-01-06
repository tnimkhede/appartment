const express = require('express');
const router = express.Router();
const {
    getTickets,
    createTicket,
    updateTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTickets).post(protect, createTicket);
router.put('/:id', protect, updateTicket);

module.exports = router;
