const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const schedule = new Schema({
  companyId: {
    type: mongoose.Types.ObjectId,
    ref: 'company',
    required: true
  },

  customerId: {
    type: mongoose.Types.ObjectId,
    ref: 'customer',
    required: true
  },

  colaboratorId: {
    type: mongoose.Types.ObjectId,
    ref: 'colaborator',
    required: true
  },

  specialtyId: {
    type: mongoose.Types.ObjectId,
    ref: 'service',
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  commission: {
    type: Number,
  },

  value: {
    type: Number,
    required: true
  },

  /**
  transactionId: {
    type: String,
  },
   */
  
  dateRegister: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('schedule', schedule);