# Plano de Configuração do Dev Container com AdminJS v7

Este documento descreve a estrutura de diretórios e componentes essenciais para o projeto.

## 1. Organização do Projeto

### 1.1 Estrutura de Diretórios
```plaintext
.
├── .devcontainer/          # Configurações do ambiente de desenvolvimento
│   ├── devcontainer.json   # Configurações VS Code e extensões
│   ├── docker-compose.yml  # Configuração dos serviços (app e db)
│   └── Dockerfile         # Configuração da imagem do container
│
├── backend/               # Sistema Administrativo (AdminJS)
│   ├── src/              # Código fonte do backend
│   │   ├── admin/        # Configurações do AdminJS
│   │   ├── config/       # Configurações gerais
│   │   ├── models/       # Modelos do MongoDB
│   │   └── routes/       # Rotas da API
│   ├── scripts/          # Scripts de utilidade
│   │   └── bundle-adminjs.js  # Gerador do bundle AdminJS
│   ├── public/           # Arquivos estáticos
│   │   └── admin/        # Assets do AdminJS
│   ├── uploads/          # Upload de arquivos
│   └── package.json      # Dependências do Node.js
│
├── frontend/             # Site Estático
│   ├── css/             # Estilos do site
│   │   ├── contato.css
│   │   ├── diretor-obras.css
│   │   ├── galeria-*.css
│   │   ├── historico.css
│   │   ├── mapa.css
│   │   ├── missao-visao.css
│   │   ├── om-engenharia.css
│   │   └── style.css
│   │
│   ├── js/              # Scripts do site
│   │   ├── galeriaHistorica.js
│   │   ├── index.js
│   │   ├── jsmapa.js
│   │   ├── livroEngenharia.js
│   │   └── paginasnew.js
│   │
│   ├── imagens/         # Imagens estáticas
│   │   ├── galeria/
│   │   ├── logos-om/
│   │   └── GALERIA_DOS_ANTIGOS_DIRETORES_DOC_2/
│   │
│   ├── imgnews/         # Imagens de notícias
│   │   ├── BR-135/
│   │   ├── BR-222/
│   │   ├── BR-367/
│   │   └── [outras pastas de notícias]
│   │
│   ├── paginas/         # Páginas HTML
│   │   ├── contato.html
│   │   ├── diretor-obras.html
│   │   ├── galeria-*.html
│   │   ├── historico.html
│   │   ├── missao-visao.html
│   │   ├── om-engenharia.html
│   │   └── paginanew.html
│   │
│   └── index.html       # Página inicial
│
├── arquivos/            # Documentos e PDFs
│   ├── Gen_Bernardes.pdf
│   └── livros/
│       ├── tomo1.pdf
│       ├── tomo2.pdf
│       └── tomo3.pdf
│
├── adminjs-docs/        # Documentação do AdminJS
│   ├── basics/          # Guias básicos
│   ├── deployment/      # Instruções de implantação
│   ├── faq/            # Perguntas frequentes
│   ├── installation/    # Guias de instalação
│   ├── tutorials/       # Tutoriais práticos
│   └── ui-customization/ # Personalização da interface
│
└── package.json        # Dependências globais do projeto

### 1.2 Pontos de Atenção

1. **Diretórios com Permissões Especiais**:
   - `/backend/uploads`: chmod 775 (escrita para usuário node)
   - `/backend/public/admin`: chmod 775 (bundle do AdminJS)

2. **Volumes Docker**:
   - `adminjs-node-modules`: Cache de node_modules
   - `mongodb-data`: Dados persistentes do MongoDB

3. **Portas Expostas**:
   - 3000: AdminJS (host) -> 3000 (container)
   - 27018: MongoDB (host) -> 27017 (container)
   - 9229: Debug Node.js
```

---

## 3. Fluxo de Trabalho

### 3.1 Comandos Essenciais
```bash
# Inicialização
docker-compose up --build -d

# Acesso ao container
docker-compose exec app bash

# Logs em tempo real
docker-compose logs -f app
```

### 3.2 Estratégia de Volumes
| Volume              | Propósito                     | Localização Container       |
|---------------------|-------------------------------|------------------------------|
| node_modules        | Cache de dependências Node.js | /workspace/backend/node_modules |
| mongodb_data        | Dados persistentes MongoDB    | /data/db                     |

---

## 4. Monitoramento

### 4.1 Healthcheck Endpoint
```javascript
app.get('/health', async (req, res) => {
  const status = {
    database: mongoose.connection.readyState === 1,
    mongo_tools: {
      mongoexport: await checkTool('mongoexport --version'),
      mongodump: await checkTool('mongodump --version')
    }
  };
  res.status(200).json({ status: 'OK', details: status });
});
```

### 4.2 Métricas
```bash
# Uso de recursos
docker stats $(docker-compose ps -q)

# Uso de volumes
docker system df -v
```

---

## 5. Segurança

### 5.1 Boas Práticas
```bash
# Rotação de credenciais
openssl rand -base64 32 | tee -a .env

# Atualizações de segurança
docker-compose exec app npm audit fix --force
```

### 5.2 Backup MongoDB
```bash
docker-compose exec db mongodump --archive=/backup.gz --gzip
docker cp <container_id>:/backup.gz ./backup_$(date +%Y%m%d).gz
```

---

## 6. Solução de Problemas

### 6.1 Diagnóstico
```bash
# Verificar processos
docker-compose exec app ps aux

# Testar conexão MongoDB
docker-compose exec app mongosh "${MONGODB_URI}"
```

### 6.2 Recuperação
```bash
# Reset completo
docker-compose down -v && docker-compose up --build

# Limpeza de volumes
docker volume rm $(docker volume ls -q --filter name=doc-adminjs)
```

---

## 7. Validação Final

| Componente            | Status | Verificação                                                                              |
|-----------------------|--------|------------------------------------------------------------------------------------------|
| Dockerfile            | ✅     | Imagem base node:18-bullseye, repositório MongoDB e mongodb-database-tools configurados     |
| MongoDB Tools         | ✅     | Instalação via repositório oficial confirmada                                              |
| Endpoint /health      | ✅     | Implementado e validado via curl                                                           |
| Estrutura de pastas   | ✅     | Diretórios criados com mkdir -p e permissões verificadas                                    |
| Permissões uploads    | ✅     | chmod 775 aplicado corretamente                                                            |
| MongoDB URI           | ✅     | Parâmetros configurados com retryWrites=false e directConnection=true                        |
| Package.json          | ✅     | Dependências atualizadas e scripts configurados (incluindo @adminjs/cli e nodemon)            |
| Script de bundle      | ✅     | Bundle do AdminJS implementado com tratamento de erros e watch habilitado                   |

| Componente         | Verificação                     |
|--------------------|---------------------------------|
| Dockerfile         | Instala mongodb-database-tools |
| Healthcheck        | Retorna HTTP 200               |
| Volumes            | Persistência garantida         |
| Segurança          | Credenciais rotacionáveis      |
```

Este arquivo Markdown organiza toda a configuração em seções claras, mantendo a estrutura técnica original enquanto melhora a legibilidade. Os códigos estão formatados corretamente e os diagramas estão representados visualmente.


