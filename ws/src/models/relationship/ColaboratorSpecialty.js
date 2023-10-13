const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colaboratorSpecialty = new Schema({

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

module.exports = mongoose.model('colaboratorSpecialty', colaboratorSpecialty);