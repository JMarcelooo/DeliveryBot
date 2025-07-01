
const Pedido = require('../models/Pedido');

/**
 * @param {Object} dados 
 */
async function salvarPedido(dados) {
  try {
    let total = 0
    
    dados.itens.forEach(item => {
        total += item.quantidade * item.precoUnitario;
    });

    const novoPedido = new Pedido({
      numero: dados.numero,
      itens: dados.itens,  
      endereco: dados.endereco,
      pagamento: dados.pagamento,
      valorTotal: total
    });

    await novoPedido.save();
    console.log('✅ Pedido salvo no MongoDB:', novoPedido);
    return novoPedido;

  } catch (error) {
    console.error('❌ Erro ao salvar pedido:', error);
    throw error;
  }
}

/**
 * @param {Object} pedido 
 * @returns {String} 
 */
function listarPedido(pedido) {
  if (!pedido.itens || pedido.itens.length === 0) {
    return '🚫 Nenhum item adicionado.';
  }

  let total = 0;

  const itensTexto = pedido.itens
    .map((item, index) => {
      const subtotal = item.quantidade * item.precoUnitario;
      total += subtotal;
      return `${index + 1}️⃣ ${item.nome} (x${item.quantidade}) - R$${subtotal}`;
    })
    .join('\n');

  return `
📝 *Resumo do Pedido:*
${itensTexto}

💲 *Total:* R$${total}

📍 Endereço: ${pedido.endereco || 'Não informado'}
💰 Pagamento: ${pedido.pagamento || 'Não informado'}

✅ Para confirmar, digite *Confirmar*
❌ Para cancelar, digite *Cancelar*
  `.trim();
}

module.exports = {
  salvarPedido,
  listarPedido
};
