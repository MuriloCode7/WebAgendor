const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colaborator = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  avatar: String,

  email: {
    type: String,
    required: [true, "E-mail is required"],
  },

  password: {
    type: String,
    default: null,
  },

  phone: {
    type: String,
    required: [true, "Phone is required"],
  },

  address: {
    city: String,
    uf: String,
    cep: String,
    number: String,
    country: String,
  },

  gender: {
    type: String,
    enum: ["M", "F"],
    required: true,
  },

  dateBirth: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
    enum: ["A", "I"],
    default: "A",
  },

  bankAccount: {
    holder: {
      type: String,
    },
    cpfCnpj: {
      type: String,
    },
    bank: {
      type: String,
    },
    type: {
      type: String,
      enum: ["conta_corrente", "conta_poupanca"],
      default: "conta_corrente"
    },
    agency: {
      type: String,
    },
    number: {
      type: String,
    },
    dv: {
      type: String,
    },
  },

  recipientId: {
    type: String,
  },

  dateRegister: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("colaborator", colaborator);
