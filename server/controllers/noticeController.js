const { Notice } = require('../models');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
    try {
        const notice = await Notice.create({
            ...req.body,
            createdById: req.user.id,
        });
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res) => {
    try {
        const notice = await Notice.findByPk(req.params.id);

        if (notice) {
            await notice.update(req.body);
            res.json(notice);
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByPk(req.params.id);

        if (notice) {
            await notice.destroy();
            res.json({ message: 'Notice removed' });
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNotices, createNotice, updateNotice, deleteNotice };
