const { Poll, User } = require('../models');

// @desc    Get all polls
// @route   GET /api/polls
// @access  Private
const getPolls = async (req, res) => {
    try {
        const polls = await Poll.findAll({
            include: [{ model: User, as: 'createdBy', attributes: ['name'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a poll
// @route   POST /api/polls
// @access  Private/Admin
const createPoll = async (req, res) => {
    try {
        const poll = await Poll.create({
            ...req.body,
            createdById: req.user.id,
        });
        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vote on a poll
// @route   POST /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
    const { optionIndex } = req.body;

    try {
        const poll = await Poll.findByPk(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if user already voted
        if (poll.votedBy.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already voted' });
        }

        // Update vote count
        const options = poll.options;
        if (optionIndex >= 0 && optionIndex < options.length) {
            options[optionIndex].votes += 1;
            poll.votedBy.push(req.user.id);
            poll.options = options;

            await poll.save();
            res.json(poll);
        } else {
            res.status(400).json({ message: 'Invalid option' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a poll
// @route   PUT /api/polls/:id
// @access  Private/Admin
const updatePoll = async (req, res) => {
    try {
        const poll = await Poll.findByPk(req.params.id);

        if (poll) {
            await poll.update(req.body);
            res.json(poll);
        } else {
            res.status(404).json({ message: 'Poll not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a poll
// @route   DELETE /api/polls/:id
// @access  Private/Admin
const deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findByPk(req.params.id);

        if (poll) {
            await poll.destroy();
            res.json({ message: 'Poll removed' });
        } else {
            res.status(404).json({ message: 'Poll not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPolls,
    createPoll,
    votePoll,
    updatePoll,
    deletePoll,
};
