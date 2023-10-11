const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schedule = new Schema({
  companyId: {
    type: mongoose.Types.ObjectId,
    ref: 'company',
    required: true,
  },

  specialties: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'service',
      required: true,
    },
  ],

  colaborators: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'colaborator',
      required: true,
    },
  ],

  days: {
    type: [Number],
    required: true,
  },

  startTime: {
    type: Date,
    required: true,
  },

  endTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('schedule', schedule);
