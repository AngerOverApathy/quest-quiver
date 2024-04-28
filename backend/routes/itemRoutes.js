const express = require('express');
const router = express.Router();

const {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment
    } = require('../controllers/itemController');

    module.exports = router;