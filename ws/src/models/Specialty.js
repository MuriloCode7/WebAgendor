const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const specialty = new Schema({
  companyId: {
    type: mongoose.Types.ObjectId,
    ref: 'company',
    required: true
  },

  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  commission: {
    type: Number, // % de comissao sobre o preco 
    required: true,
  },

  duration: {
    type: Number, // Duração em minutos
    required: true,
  },

  recurrence: {
    type: Number,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["A", "I", "E"],
    default: "A",
  },
  
  dateRegister: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("specialty", specialty);
