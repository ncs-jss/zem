var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var eventSchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  segment_id: {
    type: String
  },
  schedule: {
    day: {
      type: Number,
      enum: [1, 2, 3, 4]
    },
    hour: {
      type: Number,
      min: 8,
      max: 23
    },
    minute: {
      type: Number,
      min: 0,
      max: 59
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
