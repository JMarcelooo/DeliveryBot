const Reserva = require('../models/Reserva');

/**
 * @returns {Array} mesas disponíveis
 */
async function listarMesasDisponiveis() {
  try {
    const mesas = await Reserva.find({ disponivel: true });
    return mesas;
  } catch (error) {
    console.error('❌ Erro ao listar mesas disponíveis:', error);
    throw error;
  }
}

/**
 
 * @param {Number} numeroMesa
 * @param {String} cliente
 * @returns {Object}
 */
async function criarReserva(numeroMesa, cliente) {
  try {
    const mesa = await Reserva.findOne({ numeroMesa: numeroMesa });

    if (!mesa) {
      return { sucesso: false, mensagem: '🚫 Mesa não encontrada.' };
    }

    if (!mesa.disponivel) {
      return { sucesso: false, mensagem: '🚫 Mesa já está reservada.' };
    }

    mesa.disponivel = false;
    mesa.cliente = cliente;
    await mesa.save();

    return { sucesso: true, mensagem: `✅ Mesa ${numeroMesa} reservada com sucesso!` };

  } catch (error) {
    console.error('❌ Erro ao criar reserva:', error);
    throw error;
  }
}

module.exports = {
  listarMesasDisponiveis,
  criarReserva
};