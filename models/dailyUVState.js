const mongoose = require('mongoose');

const dailyUVStateSchema = new mongoose.Schema({
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    data: {
        uvIndex: {
          type: Number,
          required: true
        },
        uvAlert: {
          type: Number,
          required: true
        },
        date: {
          type: Date,
          required: true
        }
    }
});

// Add a unique compound index on city and state


const DailyUVState = mongoose.model('DailyUVState', dailyUVStateSchema);

module.exports = DailyUVState;
