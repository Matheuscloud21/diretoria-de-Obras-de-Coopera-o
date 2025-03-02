import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import configureAdminJS from './src/admin/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const frontendDir = process.env.FRONTEND_DIR || path.join(__dirname, '..');
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1. Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // 2. Configurar AdminJS (rotas são adicionadas ao app aqui)
    const admin = await configureAdminJS(app);
    console.log('🚀 AdminJS configurado');

    // 3. Adicionar body-parser APÓS as rotas do AdminJS
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 4. Configurar outros middlewares e rotas
    app.use(express.static(frontendDir));
    app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

    // Rotas principais
    app.get('/', (req, res) => {
      res.sendFile(path.join(frontendDir, 'index.html'));
    });

    app.get('/paginas/:page', (req, res) => {
      res.sendFile(path.join(frontendDir, 'paginas', `${req.params.page}.html`));
    });

    // Healthcheck
    app.get('/health', (req, res) => {
      const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      res.status(200).json({
        status: 'OK',
        database: mongoStatus,
        timestamp: new Date().toISOString()
      });
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🌐 Servidor rodando em http://localhost:${PORT}`);
      console.log(`🔧 AdminJS disponível em http://localhost:${PORT}${admin.options.rootPath}`);
    });
  } catch (error) {
    console.error('❌ Falha na inicialização:', error.message);
    process.exit(1);
  }
}

startServer();