const Document = require('../models/Document');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
    try {
        const documents = await Document.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create document
// @route   POST /api/documents
// @access  Private/Admin
const createDocument = async (req, res) => {
    try {
        const document = await Document.create({
            ...req.body,
            uploadedBy: req.user.id,
        });
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDocuments,
    createDocument,
};
