const express = require('express');
const router = express.Router();
const {
    getPolls,
    createPoll,
    votePoll,
    updatePoll,
    deletePoll,
} = require('../controllers/pollController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPolls).post(protect, admin, createPoll);
router.post('/:id/vote', protect, votePoll);
router
    .route('/:id')
    .put(protect, admin, updatePoll)
    .delete(protect, admin, deletePoll);

module.exports = router;
