const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customer = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  avatar: {
    type: String,
    default: null,
  },

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
    street: String,
  },

  gender: {
    type: String,
    enum: ["M", "F", "O"],
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

  document: {
    type: {
      type: String,
      enum: ["cpf", "cnpj"],
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
  },

  customerId: {
    type: String,
    required: true,
  },

  dateRegister: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("customer", customer);
