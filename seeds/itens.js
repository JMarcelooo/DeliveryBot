const mongoose = require('mongoose');
const Item = require('../models/Item');
require('dotenv').config();

const items = [
  { nome: 'Hambúrguer', preco: 25 },
  { nome: 'Pizza Família', preco: 40 },
  { nome: 'Refrigerante', preco: 5 },
  { nome: 'Açaí', preco: 16 },
];

async function populate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB conectado!');

    for (const item of items) {
      const existe = await Item.findOne({ nome: item.nome });
      if (existe) {
        console.log(`🔎 Item já existe: ${item.nome}`);
      } else {
        await Item.create(item);
        console.log(`✅ Item inserido: ${item.nome}`);
      }
    }

    console.log('✅ População concluída!');
    process.exit();

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

populate();
