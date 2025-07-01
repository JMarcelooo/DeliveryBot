const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  numero: String,
  itens: [
    {
      nome: String,
      quantidade: Number,
      precoUnitario: Number 
    }
  ],
  endereco: String,
  pagamento: String,
  valorTotal: Number, 
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', PedidoSchema);
