const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Com a seguinte estrutura é possivel fazer referenciacao dinamica */
const file = new Schema({
  referenceId: {
    type: Schema.Types.ObjectId,  
    refPath: 'model'
  },

  model: {
    type: String,
    required: true,
    enum: ['specialty', 'company']
  },

  path: {
    type: String,
    required: true,
  },

  dateRegister: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('file', file);