const { Bill, Unit } = require('../models');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [{ model: Unit, attributes: ['number'] }],
        });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my bills
// @route   GET /api/bills/my
// @access  Private
const getMyBills = async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [{ model: Unit, attributes: ['number'] }],
        });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a bill
// @route   POST /api/bills
// @access  Private/Admin
const createBill = async (req, res) => {
    try {
        const bill = await Bill.create(req.body);
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pay a bill
// @route   PUT /api/bills/:id/pay
// @access  Private
const payBill = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);

        if (bill) {
            bill.status = 'paid';
            bill.paidDate = new Date();
            await bill.save();
            res.json(bill);
        } else {
            res.status(404).json({ message: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a bill
// @route   PUT /api/bills/:id
// @access  Private/Admin
const updateBill = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);

        if (bill) {
            await bill.update(req.body);
            res.json(bill);
        } else {
            res.status(404).json({ message: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a bill
// @route   DELETE /api/bills/:id
// @access  Private/Admin
const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);

        if (bill) {
            await bill.destroy();
            res.json({ message: 'Bill removed' });
        } else {
            res.status(404).json({ message: 'Bill not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBills, getMyBills, createBill, payBill, updateBill, deleteBill };
