const EmergencyContact = require('../models/EmergencyContact');

// @desc    Get all emergency contacts
// @route   GET /api/emergency
// @access  Private
const getEmergencyContacts = async (req, res) => {
    try {
        const contacts = await EmergencyContact.findAll();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmergencyContacts,
};
