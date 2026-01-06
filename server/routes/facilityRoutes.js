const express = require('express');
const router = express.Router();
const {
    getFacilities,
    getFacilityBookings,
    createFacilityBooking,
    updateFacilityBooking,
    deleteFacilityBooking,
    createFacility,
    updateFacility,
    deleteFacility,
} = require('../controllers/facilityController');
const { protect, admin } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(protect, getFacilities)
    .post(protect, admin, createFacility);

router
    .route('/:id')
    .put(protect, admin, updateFacility)
    .delete(protect, admin, deleteFacility);

router
    .route('/bookings')
    .get(protect, getFacilityBookings)
    .post(protect, createFacilityBooking);

router
    .route('/bookings/:id')
    .put(protect, admin, updateFacilityBooking)
    .delete(protect, admin, deleteFacilityBooking);

module.exports = router;
