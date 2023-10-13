const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const companyCustomer = new Schema({
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

  status: {
    type: String,
    required: true,
    enum: ["A", "I"],
    default: "A",
  },

  dateRegister: {
    type: Date,
    defaul: Date.now,
  },
});

module.exports = mongoose.model('companyCustomer', companyCustomer);