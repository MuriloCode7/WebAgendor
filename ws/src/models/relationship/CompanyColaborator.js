const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companyColaborator = new Schema({
  companyId: {
    type: mongoose.Types.ObjectId,
    ref: 'company',
    required: true
  },

  colaboratorId: {
    type: mongoose.Types.ObjectId,
    ref: 'colaborator',
    required: true
  },

  status: {
    type: String,
    required: true,
    enum: ["A", "I", "E"],
    default: "A",
  },

  dateRegister: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('companyColaborator', companyColaborator);