// aqiRoutes.js
const express = require('express');
const aqiController = require('../controllers/aqiController');

const router = express.Router();



// Fetch AQI by City and State
router.get('/state/:state', aqiController.fetchAQIByState);

module.exports = router;
