const ParkingSlot = require('../models/ParkingSlot');

// @desc    Get all parking slots
// @route   GET /api/parking
// @access  Private
const getParkingSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.findAll();
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create parking slot
// @route   POST /api/parking
// @access  Private/Admin
const createParkingSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.create(req.body);
        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update parking slot
// @route   PUT /api/parking/:id
// @access  Private/Admin
const updateParkingSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findByPk(req.params.id);

        if (slot) {
            await slot.update(req.body);
            res.json(slot);
        } else {
            res.status(404).json({ message: 'Parking slot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getParkingSlots,
    createParkingSlot,
    updateParkingSlot,
};
