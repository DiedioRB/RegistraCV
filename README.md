# RegistraCV

Aplicação de desenvolvimento com três serviços: frontend React/Vite, API Node/Express e Microsoft SQL Server. O backend extrai dados de currículos usando um extrator substituível, e persiste os dados confirmados no formulário com Prisma ORM.

## Iniciar em desenvolvimento

Requer Docker Desktop com Docker Compose 2.22 ou superior. Na raiz do projeto, use o modo watch para aplicar alterações automaticamente:

```sh
docker compose up --watch
```

Alterações em código frontend/backend são sincronizadas com os containers e aplicadas pelo Vite/Nodemon. Mudanças nas dependências, configurações de build ou schema do Prisma disparam rebuild automático do serviço correspondente. `docker compose up` continua iniciando os serviços sem observar alterações.

Na primeira inicialização, o SQL Server pode levar alguns instantes para ficar pronto. O backend aguarda a base, cria o database configurado e sincroniza as tabelas com Prisma.

- Frontend: http://localhost:5173
- API: http://localhost:3000/api
- Health check: http://localhost:3000/api/health
- SQL Server: localhost:1433

A senha de desenvolvimento pode ser alterada no ambiente ou em um arquivo `.env` criado a partir de `.env.example`. O volume `sqlserver_data` mantém os dados entre reinicializações.

## Fluxo de currículo

- `POST /api/curricula/extract`: recebe o PDF no campo `file`, extrai os campos e não salva no banco.
- O formulário permite revisar e editar nome, e-mail, telefone, cargo de interesse e resumo profissional.
- `POST /api/curricula`: salva os campos enviados. Se incluir `file`, o PDF é salvo em `backend/storage` com nome UUID e seu caminho fica na linha correspondente.
- `GET /api/curricula`: lista currículos cadastrados.
- `GET /api/health`: verifica a conexão com o banco.

O extrator padrão por regex está em `backend/src/extractors/curriculumExtractor.js` e pode ser substituído ao criar o controller.
Os PDFs enviados junto ao formulário final permanecem na pasta `backend/storage`, montada como volume no container do backend.
