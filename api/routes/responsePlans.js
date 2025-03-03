const express = require('express');
const router = express.Router();

const{getResponsePlans} = require('../controllers/responsePlansController');

router.get('/', getResponsePlans);

module.exports = router;