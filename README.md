# RegistraCV

Plataforma de registro de currículos desenvolvida com as tecnologias:

**Backend:**
- NodeJS 20 (imagem em Alpine Linux)
- Prisma ^6.19
    - ORM e migração do banco de dados
- MS SQL Server 2022

**Frontend:**
- React ^19.1
- Vite 7.1.5 (plugin para React ^5.0)
    - Build tool para frontend

## Como executar

O sistema roda inteiramente usando Docker. Verifique as formas de instalação de acordo com seu sistema operacional [aqui](https://docs.docker.com/engine/install/).
Como o Docker realiza a instalação das tecnologias internamente, não há necessidade de instalação externa de nenhuma ferramenta.

Alterações em código frontend/backend são sincronizadas com os containers e aplicadas pelo Vite/Nodemon.
Para executar em ambiente de desenvolvimento com atualização a cada mudança realizada, execute:
```sh
docker compose up --watch
```

Caso não haja necessidade de monitoramento de mudanças, use o comando:
```sh
docker compose up
```

Para acessar as diferentes partes do sistema, utilize as seguintes portas:

- Frontend: http://localhost:8000
- API: http://localhost:3000/api
- Health check: http://localhost:3000/api/health
- SQL Server: localhost:1433

As configurações de portas podem ser alteradas a partir do arquivo ```.env```.

## Fluxo de currículo

- `POST /api/curricula/extract`: recebe o PDF no campo `file`, extrai os campos e não salva no banco.
- O formulário permite revisar e editar nome, e-mail, telefone, cargo de interesse e resumo profissional.
- `POST /api/curricula`: salva os campos enviados. Se incluir `file`, o PDF é salvo em `backend/storage` com nome UUID e seu caminho fica na linha correspondente.
- `GET /api/curricula`: lista currículos cadastrados.
- `GET /api/health`: verifica a conexão com o banco.

## Testes da API

Os testes HTTP usam Jest e Supertest fora do ambiente dockerizado. Para executá-los localmente:
```bash
    cd backend
    npm install
    npm test
```

Os testes usam um repositório simulado; não precisam de conexão com o SQL Server.