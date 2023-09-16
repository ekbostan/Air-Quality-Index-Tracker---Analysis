const express = require('express');
const uvIndexController = require('../controllers/uvIndexController');

const router = express.Router();

// Hourly UV Index by ZIP Code
router.route('/hourly/zip/:zip').get(uvIndexController.fetchUVIndexByZip);

// Hourly UV Index by City and State
router.route('/hourly/city/:city/state/:state').get(uvIndexController.fetchUVIndexByCityAndState);


// Daily UV Index by ZIP Code
router.get('/daily/zip/:zipcode').get(uvIndexController.getDailyByZip);

// Daily UV Index by City and State
router.get('/daily/city/:city/state/:state', uvIndexController.getDailyByCityState);

module.exports = router;
