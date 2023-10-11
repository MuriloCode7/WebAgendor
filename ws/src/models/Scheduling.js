const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const scheduling = new Schema({
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

  serviceId: {
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

  transactionId: {
    type: String,
    required: true
  },
  
  dateRegister: {
    type: Date,
    defaul: Date.now,
  },
});

module.exports = mongoose.model('scheduling', scheduling);