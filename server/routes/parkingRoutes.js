const express = require('express');
const router = express.Router();
const {
    getParkingSlots,
    createParkingSlot,
    updateParkingSlot,
} = require('../controllers/parkingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getParkingSlots).post(protect, admin, createParkingSlot);
router.put('/:id', protect, admin, updateParkingSlot);

module.exports = router;
