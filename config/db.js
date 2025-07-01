// db.js (ou no topo do index.js)
const mongoose = require('mongoose');
require('dotenv').config()

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
  }
}

module.exports = connectDB;
