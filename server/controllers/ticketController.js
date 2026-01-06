const { Ticket, User } = require('../models');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            include: [
                { model: User, as: 'createdBy', attributes: ['name', 'unitNumber'] },
                { model: User, as: 'assignedTo', attributes: ['name'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
    const { category, subject, description, priority, unitId } = req.body;

    try {
        const ticket = await Ticket.create({
            unitId,
            createdById: req.user.id,
            category,
            subject,
            description,
            priority,
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);

        if (ticket) {
            await ticket.update(req.body);
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTickets, createTicket, updateTicket };
