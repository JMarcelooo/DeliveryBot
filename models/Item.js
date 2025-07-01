const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true }
});

module.exports = mongoose.model('Item', ItemSchema);
