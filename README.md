# SGI PROTEGE - Controle de Viaturas (Backend + SQL)

Backend Node.js/Express com banco de dados PostgreSQL (Render) para o sistema de gestão de frotas.

## Stack
- Node.js 18+ / Express
- Prisma ORM + PostgreSQL
- Render (Blueprint `render.yaml`) para provisionar banco e web service

## Estrutura
- `src/` - código do servidor (rotas, controllers)
- `prisma/schema.prisma` - modelo de dados (SQL)
- `prisma/seed.js` - dados iniciais
- `gestaodefrota.html` - frontend (servido estaticamente)
- `render.yaml` - Blueprint Render

## Rodar localmente
1. Instale dependências: `npm install`
2. Configure `.env` (copie de `.env.example`) com `DATABASE_URL`
3. Gere client: `npx prisma generate`
4. Migrar: `npx prisma migrate dev`
5. Seed: `npm run seed`
6. Start: `npm run dev`

## Como subir ao GitHub (manual, sem PAT)
Como não foi fornecido token, siga estes passos no GitHub Desktop (instalado):

1. Abra o GitHub Desktop
2. File → Add Local Repository → selecione a pasta `frota gustavo`
3. Publish repository → nome: `frota-gustavo-backend` → marque "Keep this code private" se desejar → Publish
4. Após publicado, o Render pode ser conectado ao repositório

Ou via git CLI (após criar o repo vazio no GitHub):
```bash
git remote add origin https://github.com/SEU_USUARIO/frota-gustavo-backend.git
git branch -M main
git push -u origin main
```
1. Crie conta em https://render.com
2. Conecte este repositório GitHub ao Render
3. O Render detectará `render.yaml` e provisionará banco + web service
4. Após deploy, rode seed (opcional) via Render Shell: `npm run seed`

## Endpoints API
- `GET/POST /api/veiculos`
- `GET/PUT/DELETE /api/veiculos/:id`
- `GET/POST /api/motoristas`
- `GET/PUT/DELETE /api/motoristas/:id`
- `GET /api/viagens`, `POST /api/viagens/saida`, `POST /api/viagens/retorno`, `PUT/DELETE /api/viagens/:id`
- `GET/POST/PUT/DELETE /api/checklists`
- `GET /api/manutencoes`, `POST /api/manutencoes/entrada`, `POST /api/manutencoes/saida`, `PUT/DELETE /api/manutencoes/:id`
- `GET/POST/DELETE /api/alertas`
- `GET /api/dashboard/stats`
- `GET /api/health`
