const express = require('express');
const router = express.Router();
const {
    getBills,
    getMyBills,
    createBill,
    payBill,
    updateBill,
    deleteBill,
} = require('../controllers/billController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBills).post(protect, admin, createBill);
router.get('/my', protect, getMyBills);
router.put('/:id/pay', protect, payBill);
router
    .route('/:id')
    .put(protect, admin, updateBill)
    .delete(protect, admin, deleteBill);

module.exports = router;
