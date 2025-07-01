const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  numeroMesa: {
    type: Number,
    required: true,
    unique: true  
  },
  disponivel: {
    type: Boolean,
    default: true 
  },
  cliente: {
    type: String, 
    default: null
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reserva', ReservaSchema);