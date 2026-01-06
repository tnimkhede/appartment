const { Facility, FacilityBooking, Unit, User } = require('../models');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Private
const getFacilities = async (req, res) => {
    try {
        const facilities = await Facility.findAll();
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all facility bookings
// @route   GET /api/facilities/bookings
// @access  Private
const getFacilityBookings = async (req, res) => {
    try {
        const bookings = await FacilityBooking.findAll({
            include: [
                { model: Facility, attributes: ['name', 'isPaid', 'pricePerHour'] },
                { model: Unit, attributes: ['number', 'block'] },
                { model: User, as: 'bookedBy', attributes: ['name', 'phone'] },
            ],
            order: [['date', 'DESC']],
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a facility booking
// @route   POST /api/facilities/bookings
// @access  Private
const createFacilityBooking = async (req, res) => {
    try {
        const booking = await FacilityBooking.create({
            ...req.body,
            bookedById: req.user.id,
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update facility booking
// @route   PUT /api/facilities/bookings/:id
// @access  Private/Admin
const updateFacilityBooking = async (req, res) => {
    try {
        const booking = await FacilityBooking.findByPk(req.params.id);

        if (booking) {
            await booking.update(req.body);
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete facility booking
// @route   DELETE /api/facilities/bookings/:id
// @access  Private/Admin
const deleteFacilityBooking = async (req, res) => {
    try {
        const booking = await FacilityBooking.findByPk(req.params.id);

        if (booking) {
            await booking.destroy();
            res.json({ message: 'Booking removed' });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a facility
// @route   POST /api/facilities
// @access  Private/Admin
const createFacility = async (req, res) => {
    try {
        const facility = await Facility.create(req.body);
        res.status(201).json(facility);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Private/Admin
const updateFacility = async (req, res) => {
    try {
        const facility = await Facility.findByPk(req.params.id);

        if (facility) {
            await facility.update(req.body);
            res.json(facility);
        } else {
            res.status(404).json({ message: 'Facility not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Private/Admin
const deleteFacility = async (req, res) => {
    try {
        const facility = await Facility.findByPk(req.params.id);

        if (facility) {
            await facility.destroy();
            res.json({ message: 'Facility removed' });
        } else {
            res.status(404).json({ message: 'Facility not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFacilities,
    getFacilityBookings,
    createFacilityBooking,
    updateFacilityBooking,
    deleteFacilityBooking,
    createFacility,
    updateFacility,
    deleteFacility,
};
