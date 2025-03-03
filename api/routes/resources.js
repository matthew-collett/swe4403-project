const express = require('express');
const router = express.Router();

const{getResources, createResource} = require('../controllers/resourcesController');

router.get('/', getResources);
router.post('/', createResource);

module.exports = router;