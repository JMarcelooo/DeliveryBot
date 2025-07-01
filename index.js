process.env.GOOGLE_APPLICATION_CREDENTIALS = './chave-gcp.json';
const venom = require('venom-bot');
const connectDB = require('./config/db.js');
const { salvarPedido, listarPedido } = require('./controllers/pedidoController');
const Item = require('./models/Item');
const { listarMesasDisponiveis, criarReserva } = require('./controllers/reservaController');
const { gerarAudio } = require('./util/tts.js');

connectDB();

const sessions = {};

venom
  .create({
    session: 'delivery-bot',
    browserArgs: ['--no-sandbox'],
    headless: false
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (message) => {
    const userId = message.from;
    const numeroAutorizado = '558491836284@c.us';

    if (userId !== numeroAutorizado) {
      console.log('Número não autorizado:', userId);
      return;
    }

    if (!sessions[userId]) {
      sessions[userId] = {
        step: 0,
        pedido: { itens: [] },
      };
    }

    const userSession = sessions[userId];
    const msg = message.body.trim().toLowerCase();

    switch (userSession.step) {
      case 0:
        await client.sendText(userId, '👋 Olá! Bem-vindo ao *Delivery Do Marcelo*!');
        await client.sendImage(
          userId,
          'https://www.engelvoelkers.com/wp-content/uploads/2014/07/pizza-stock.jpg',
          'promo.jpg',
          'Promoção do dia!'
        );
        await client.sendText(
          userId,
          '📋 Escolha uma opção:\n1️⃣ Fazer Pedido\n2️⃣ Fazer Reserva\n3️⃣ Cancelar Atendimento'
        );
        userSession.step = 1;
        break;

      case 1:
        if (msg.includes('1')) {
          const cardapio = await Item.find();
          if (!cardapio || cardapio.length === 0) {
            await client.sendText(userId, '🚫 Cardápio não disponível no momento.');
            return;
          }
          let textoCardapio = '🍔 *CARDÁPIO*:\n';
          cardapio.forEach((item, i) => {
            textoCardapio += `${i + 1}️⃣ ${item.nome} - R$${item.preco}\n`;
          });
          textoCardapio += '\nDigite o número do item que deseja pedir.';
          await client.sendText(userId, textoCardapio);

          userSession.cardapio = cardapio;
          userSession.step = 2;

        } else if (msg.includes('2')) {
          await client.sendText(userId, '📅 Para fazer uma reserva, informe a data e horário desejado.');
          userSession.step = 99;

        } else if (msg.includes('3')) {
          await client.sendText(userId, '🚫 Atendimento cancelado. Se precisar, é só digitar *Oi* para recomeçar.');
          userSession.step = 0;

        } else {
          await client.sendText(userId, '❌ Opção inválida. Escolha 1️⃣, 2️⃣ ou 3️⃣.');
        }
        break;

      case 2:
        const escolha = parseInt(msg);
        if (!isNaN(escolha) && escolha > 0 && escolha <= userSession.cardapio.length) {
          const itemSelecionado = userSession.cardapio[escolha - 1];
          userSession.itemTemp = {
            nome: itemSelecionado.nome,
            precoUnitario: itemSelecionado.preco
          };
          await client.sendText(userId, `✅ ${itemSelecionado.nome} selecionado. Informe a quantidade:`);
          userSession.step = 3;

        } else {
          await client.sendText(userId, '❌ Escolha inválida. Digite o número do item.');
        }
        break;

      case 3:
        const quantidade = parseInt(msg);
        if (!isNaN(quantidade) && quantidade > 0) {
          userSession.pedido.itens.push({
            nome: userSession.itemTemp.nome,
            quantidade: quantidade,
            precoUnitario: userSession.itemTemp.precoUnitario
          });
          delete userSession.itemTemp;

          await client.sendText(userId, '➕ Deseja adicionar mais itens?\n1️⃣ - Sim\n2️⃣ - Não');
          userSession.step = 31;

        } else {
          await client.sendText(userId, '❌ Quantidade inválida. Informe um número.');
        }
        break;

      case 31:
        if (msg.includes('1')) {
          const cardapio = await Item.find();
          let textoCardapio = '🍔 *CARDÁPIO*:\n';
          cardapio.forEach((item, i) => {
            textoCardapio += `${i + 1}️⃣ ${item.nome} - R$${item.preco}\n`;
          });
          textoCardapio += '\nDigite o número do item:';
          await client.sendText(userId, textoCardapio);

          userSession.cardapio = cardapio;
          userSession.step = 2;

        } else if (msg.includes('2')) {
          await client.sendText(userId, '📍 Agora informe seu endereço de entrega (Nome da rua e Número da casa):');
          userSession.step = 4;

        } else {
          await client.sendText(userId, '❌ Responda *1* ou *2*.');
        }
        break;

      case 4:
        userSession.pedido.endereco = message.body.trim();
        await client.sendText(userId, '💰 Informe o método de pagamento (ex: Dinheiro, Cartão, PIX):');
        userSession.step = 5;
        break;

      case 5:
        userSession.pedido.pagamento = message.body.trim();

        let total = 0;
        userSession.pedido.itens.forEach(item => {
          total += item.quantidade * item.precoUnitario;
        });
        userSession.pedido.valorTotal = total;

        const resumo = listarPedido(userSession.pedido);
        await client.sendText(userId, resumo);
        userSession.step = 6;
        break;

      case 6:
        if (msg === 'confirmar') {
          await salvarPedido({
            numero: userId,
            itens: userSession.pedido.itens,
            endereco: userSession.pedido.endereco,
            pagamento: userSession.pedido.pagamento
          });

          
          const listaDeItens = userSession.pedido.itens
            .map(item => `${item.quantidade} ${item.nome}`)
            .join(', ');
          const total = userSession.pedido.valorTotal;

          const textoAudio = `Pedido confirmado! Você pediu ${listaDeItens} com valor total de ${total} reais.`;

          const audioPath = await gerarAudio(textoAudio, `pedido_${userId}`);

          // ✅ Manda texto + áudio:
          await client.sendText(userId, `🎉 Pedido confirmado! Valor total: R$${total}\nObrigado pelo seu pedido.`);
          await client.sendFile(userId, audioPath, `pedido.mp3`, `🔊 Seu pedido em áudio!`);

          delete sessions[userId];

        } else if (msg === 'cancelar') {
          await client.sendText(userId, '🚫 Pedido cancelado! Voltando ao menu inicial...');
          userSession.step = 0;

        } else {
          await client.sendText(userId, '❌ Digite *Confirmar* ou *Cancelar*.');
        }
        break;

        case 99:
            const mesas = await listarMesasDisponiveis();
            if (!mesas || mesas.length === 0) {
                await client.sendText(userId, '🚫 Nenhuma mesa disponível no momento.');
                userSession.step = 0;
                break;
            }

            let textoMesas = '📋 *Mesas Disponíveis:*\n';
            mesas.forEach(mesa => {
                textoMesas += `• Mesa ${mesa.numeroMesa}\n`;
            });
            textoMesas += '\nDigite o número da mesa que deseja reservar:';
            await client.sendText(userId, textoMesas);

            userSession.step = 100;
            break;
        
        case 100:
            const numeroMesa = parseInt(msg);
            if (isNaN(numeroMesa)) {
                await client.sendText(userId, '❌ Número inválido. Digite apenas o número da mesa.');
                break;
            }

            const resultado = await criarReserva(numeroMesa, userId);
            await client.sendText(userId, resultado.mensagem);

            userSession.step = 0;
            break;

      default:
        await client.sendText(userId, '⚡ Vamos começar de novo! Digite *Oi* para reiniciar.');
        userSession.step = 0;
        break;
    }
  });
}
