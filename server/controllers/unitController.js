const { Unit, User } = require('../models');

// @desc    Get all units
// @route   GET /api/units
// @access  Private
const getUnits = async (req, res) => {
    try {
        const units = await Unit.findAll({
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'email'] },
                { model: User, as: 'tenant', attributes: ['id', 'name', 'phone', 'email'] },
            ],
        });
        res.json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unit by ID
// @route   GET /api/units/:id
// @access  Private
const getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'email'] },
                { model: User, as: 'tenant', attributes: ['id', 'name', 'phone', 'email'] },
            ],
        });

        if (unit) {
            res.json(unit);
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a unit
// @route   POST /api/units
// @access  Private/Admin
const createUnit = async (req, res) => {
    try {
        const unit = await Unit.create(req.body);
        res.status(201).json(unit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update unit
// @route   PUT /api/units/:id
// @access  Private/Admin
const updateUnit = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            await unit.update(req.body);
            res.json(unit);
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete unit
// @route   DELETE /api/units/:id
// @access  Private/Admin
const deleteUnit = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            await unit.destroy();
            res.json({ message: 'Unit removed' });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add family member to unit
// @route   POST /api/units/:id/family
// @access  Private
const addFamilyMember = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const familyMembers = unit.familyMembers || [];
            familyMembers.push(req.body);
            unit.familyMembers = familyMembers;
            await unit.save();
            res.json(unit);
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update family member
// @route   PUT /api/units/:id/family/:index
// @access  Private
const updateFamilyMember = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const familyMembers = unit.familyMembers || [];
            const index = parseInt(req.params.index);

            if (index >= 0 && index < familyMembers.length) {
                familyMembers[index] = { ...familyMembers[index], ...req.body };
                unit.familyMembers = familyMembers;
                await unit.save();
                res.json(unit);
            } else {
                res.status(404).json({ message: 'Family member not found' });
            }
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete family member
// @route   DELETE /api/units/:id/family/:index
// @access  Private
const deleteFamilyMember = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const familyMembers = unit.familyMembers || [];
            const index = parseInt(req.params.index);

            if (index >= 0 && index < familyMembers.length) {
                familyMembers.splice(index, 1);
                unit.familyMembers = familyMembers;
                await unit.save();
                res.json(unit);
            } else {
                res.status(404).json({ message: 'Family member not found' });
            }
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add vehicle to unit
// @route   POST /api/units/:id/vehicles
// @access  Private
const addVehicle = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const vehicles = unit.vehicles || [];
            vehicles.push(req.body);
            unit.vehicles = vehicles;
            await unit.save();
            res.json(unit);
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update vehicle
// @route   PUT /api/units/:id/vehicles/:index
// @access  Private
const updateVehicle = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const vehicles = unit.vehicles || [];
            const index = parseInt(req.params.index);

            if (index >= 0 && index < vehicles.length) {
                vehicles[index] = { ...vehicles[index], ...req.body };
                unit.vehicles = vehicles;
                await unit.save();
                res.json(unit);
            } else {
                res.status(404).json({ message: 'Vehicle not found' });
            }
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/units/:id/vehicles/:index
// @access  Private
const deleteVehicle = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const vehicles = unit.vehicles || [];
            const index = parseInt(req.params.index);

            if (index >= 0 && index < vehicles.length) {
                vehicles.splice(index, 1);
                unit.vehicles = vehicles;
                await unit.save();
                res.json(unit);
            } else {
                res.status(404).json({ message: 'Vehicle not found' });
            }
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add pet to unit
// @route   POST /api/units/:id/pets
// @access  Private
const addPet = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const pets = unit.pets || [];
            pets.push(req.body);
            unit.pets = pets;
            await unit.save();
            res.json(unit);
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete pet
// @route   DELETE /api/units/:id/pets/:index
// @access  Private
const deletePet = async (req, res) => {
    try {
        const unit = await Unit.findByPk(req.params.id);

        if (unit) {
            const pets = unit.pets || [];
            const index = parseInt(req.params.index);

            if (index >= 0 && index < pets.length) {
                pets.splice(index, 1);
                unit.pets = pets;
                await unit.save();
                res.json(unit);
            } else {
                res.status(404).json({ message: 'Pet not found' });
            }
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
