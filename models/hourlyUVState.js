const mongoose = require('mongoose');

const hourlyUVStateSchema = new mongoose.Schema({
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    data: [
      {
        order: {
          type: Number,
          required: true
        },
        dateTime: {
          type: Date,
          required: true
        },
        uvValue: {
          type: Number,
          required: true
        }
      }
    ]
});

// Add a unique compound index on city and state
hourlyUVStateSchema.index({ city: 1, state: 1 }, { unique: true, dropDups: true });


const HourlyUVState = mongoose.model('HourlyUVState', hourlyUVStateSchema);

module.exports = HourlyUVState;
