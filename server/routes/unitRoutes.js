const express = require('express');
const router = express.Router();
const {
    getUnits,
    getUnitById,
    createUnit,
    updateUnit,
    deleteUnit,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addPet,
    deletePet,
} = require('../controllers/unitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUnits).post(protect, admin, createUnit);
router
    .route('/:id')
    .get(protect, getUnitById)
    .put(protect, admin, updateUnit)
    .delete(protect, admin, deleteUnit);

// Family member routes
router.post('/:id/family', protect, addFamilyMember);
router.put('/:id/family/:index', protect, updateFamilyMember);
router.delete('/:id/family/:index', protect, deleteFamilyMember);

// Vehicle routes
router.post('/:id/vehicles', protect, addVehicle);
router.put('/:id/vehicles/:index', protect, updateVehicle);
router.delete('/:id/vehicles/:index', protect, deleteVehicle);

// Pet routes
router.post('/:id/pets', protect, addPet);
router.delete('/:id/pets/:index', protect, deletePet);

module.exports = router;
