FROM node:18-bullseye

# Instalar dependências do sistema
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        gnupg \
        curl \
        git \
    && mkdir -p /etc/apt/keyrings \
    # Adicionar repositório do MongoDB
    && curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | gpg --dearmor -o /etc/apt/keyrings/mongodb.gpg \
    && echo "deb [ arch=amd64,arm64 signed-by=/etc/apt/keyrings/mongodb.gpg ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list \
    && apt-get update \
    # Instalar pacotes necessários
    && apt-get install -y --no-install-recommends \
        mongodb-database-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Criar diretórios com permissões adequadas
RUN mkdir -p /workspace/backend \
    && chown -R node:node /workspace

# Configurar diretório de trabalho
WORKDIR /workspace/backend

# Instalar dependências do Node.js
COPY --chown=node:node backend/package*.json ./
RUN npm install --legacy-peer-deps

# Criar estrutura de diretórios
RUN mkdir -p \
    public/admin \
    uploads \
    scripts \
    && chown -R node:node . \
    && chmod -R 775 public uploads scripts

# Copiar arquivos do backend
COPY --chown=node:node backend/ .

USER node

# Configurar variáveis de ambiente
ENV NODE_ENV=development
ENV ADMINJS_WATCH=true
ENV CHOKIDAR_USEPOLLING=true
ENV ADMINJS_ROOT_PATH=/admin
ENV ADMINJS_BUNDLE_PATH=/workspace/backend/public/admin