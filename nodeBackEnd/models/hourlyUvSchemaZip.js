const mongoose = require('mongoose');

const hourlyUVSchema = new mongoose.Schema({
  zip: {
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
  data: [
    {
      order: {
        type: Number,
        required: true,
      },
      dateTime: {
        type: Date,
        required: true,
      },
      uvValue: {
        type: Number,
        required: true,
      },
    },
  ],
});

const HourlyUV = mongoose.model('HourlyUV', hourlyUVSchema);

module.exports = HourlyUV;
