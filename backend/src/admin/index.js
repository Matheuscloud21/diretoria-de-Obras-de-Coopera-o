import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { ComponentLoader } from 'adminjs';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { userResource } from './resources/userResource.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Registra o adaptador Mongoose
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

import { componentLoader, dashboardComponent } from './components/index.js';

const DEFAULT_ADMIN = {
  email: 'admin@admin.com',
  password: 'admin',
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const configureAdminJS = async (app) => {
  const adminOptions = {
    componentLoader,
    rootPath: process.env.ADMINJS_ROOT_PATH || '/admin',
    resources: [userResource],
    branding: {
      companyName: 'Diretoria de Obras de Cooperação',
      logo: '/admin/logo.svg',
      favicon: '/admin/favicon.ico'
    },
    locale: {
      language: 'pt-BR',
      translations: {
        // Traduções serão carregadas de src/admin/locales/
      }
    },
    dashboard: {
      component: dashboardComponent
    }
  };

  // 1. Criar instância do AdminJS
  const admin = new AdminJS(adminOptions);

  // 2. Configurar sessão
  const sessionStore = MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 dia
  });

  const sessionOptions = {
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
    name: 'adminjs',
  };

  // 3. Criar router autenticado (sem body-parser)
  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.COOKIE_SECRET,
    },
    null,
    sessionOptions
  );

  // 4. Montar router no app (antes de qualquer outro middleware)
  app.use(admin.options.rootPath, router);

  return admin;
};

export default configureAdminJS;