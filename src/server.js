require('dotenv').config();
const app = require('./app');
const prisma = require('./prisma');

const PORT = process.env.PORT || 3000;

async function main() {
  await prisma.$connect();
  console.log('Conectado ao banco de dados.');
  app.listen(PORT, () => {
    console.log(`SGI PROTEGE API rodando na porta ${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
