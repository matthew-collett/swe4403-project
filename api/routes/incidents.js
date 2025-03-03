const express = require('express');
const router = express.Router();
const {getIncidents, getIncidentById, createIncident, updateIncident, deleteIncident} = require('../controllers/incidentsController');

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/', createIncident);
router.put('/:id', updateIncident);
router.delete('/:id', deleteIncident);

module.exports = router;