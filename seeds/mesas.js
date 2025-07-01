const mongoose = require('mongoose');
const Reserva = require('../models/Reserva');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB conectado!');
    const mesas = [];

    for (let i = 1; i <= 10; i++) { 
      mesas.push({ numeroMesa: i, disponivel: true });
    }

    await Reserva.insertMany(mesas);
    console.log('Mesas criadas!');
    process.exit();
  })
  .catch(console.error);