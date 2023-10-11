const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const company = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  avatar: String,

  cover: String,
  
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
    default: null,
  },

  address: {
    city: String,
    uf: String,
    cep: String,
    number: String,
    country: String,
  },

  geo: {
    type_geo: String,
    coordinates: [Number]
  },
  
  dateRegister: {
    type: Date,
    defaul: Date.now
  },
});

/* Define a propriedade geo como uma esfera 2d para trabalhar com as questoes de localização */
company.index({geo: '2dsphere'});

module.exports = mongoose.model("company", company);
