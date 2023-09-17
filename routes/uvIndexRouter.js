const express = require('express');
const uvIndexController = require('../controllers/uvIndexController');

const router = express.Router();

// Hourly UV Index by ZIP Code
router.get('/hourly/zip/:zip',uvIndexController.fetchUVIndexHourlyByZip);

// // Hourly UV Index by City and State
router.get('/hourly/city/:city/state/:state',uvIndexController.fetchUVIndexHourlyByCityState);


// // Daily UV Index by ZIP Code
router.get('/daily/zip/:zip',uvIndexController.fetchDailyByZip);


// // Daily UV Index by City and State
router.get('/daily/city/:city/state/:state', uvIndexController.fetchDailyByCityState);

module.exports = router;
