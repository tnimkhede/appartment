const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    registerUser,
    updateUser,
    deleteUser,
    getStaff,
    addStaff,
    updateStaff,
    deleteStaff,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers).post(protect, admin, registerUser);
router
    .route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

router.route('/staff/all').get(protect, getStaff);
router.route('/staff').post(protect, admin, addStaff);
router
    .route('/staff/:id')
    .put(protect, admin, updateStaff)
    .delete(protect, admin, deleteStaff);

module.exports = router;
