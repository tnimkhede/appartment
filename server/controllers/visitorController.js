const { Visitor, Unit } = require('../models');

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private
const getVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.findAll({
            include: [{ model: Unit, attributes: ['number', 'block'] }],
            order: [['checkInTime', 'DESC']],
        });
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check-in a visitor
// @route   POST /api/visitors/checkin
// @access  Private
const checkInVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.create({
            ...req.body,
            checkInTime: new Date(),
        });
        res.status(201).json(visitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check-out a visitor
// @route   PUT /api/visitors/:id/checkout
// @access  Private
const checkOutVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findByPk(req.params.id);

        if (visitor) {
            visitor.checkOutTime = new Date();
            await visitor.save();
            res.json(visitor);
        } else {
            res.status(404).json({ message: 'Visitor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a visitor
// @route   PUT /api/visitors/:id
// @access  Private
const updateVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findByPk(req.params.id);

        if (visitor) {
            await visitor.update(req.body);
            res.json(visitor);
        } else {
            res.status(404).json({ message: 'Visitor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a visitor
// @route   DELETE /api/visitors/:id
// @access  Private
const deleteVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findByPk(req.params.id);

        if (visitor) {
            await visitor.destroy();
            res.json({ message: 'Visitor removed' });
        } else {
            res.status(404).json({ message: 'Visitor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVisitors,
    checkInVisitor,
    checkOutVisitor,
    updateVisitor,
    deleteVisitor,
};
