const mongoose = require('mongoose');

const dailyUVSchema = new mongoose.Schema({
  zipCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  uvIndex: {
    type: Number,
    required: true,
  },
  uvAlert: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const DailyUV = mongoose.model('DailyUV', dailyUVSchema);

module.exports = DailyUV;
