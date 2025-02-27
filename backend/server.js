const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const workRoutes = require('./src/routes/workRoutes');

const app = express();

// Conexão com o banco de dados
connectDB();

// Middlewares de segurança
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/works', workRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'API do DOC Admin está funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});