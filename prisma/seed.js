require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Veículos
  const veiculos = await Promise.all([
    prisma.veiculo.upsert({ where: { placa: 'OBP-4A21' }, update: {}, create: { prefixo: 'DC-01', marca: 'Chevrolet', modelo: 'S-10', placa: 'OBP-4A21', kmAtual: 45200, ano: 2022, renavam: '123456789', chassi: '9BD12345678901234', statusDispo: 'Disponível' } }),
    prisma.veiculo.upsert({ where: { placa: 'QNY-7H80' }, update: {}, create: { prefixo: 'DC-02', marca: 'Chevrolet', modelo: 'S-10', placa: 'QNY-7H80', kmAtual: 58100, ano: 2021, renavam: '987654321', chassi: '9BD54321098765432', statusDispo: 'Em Viagem' } }),
    prisma.veiculo.upsert({ where: { placa: 'RNY-1A23' }, update: {}, create: { prefixo: 'DC-03', marca: 'Chevrolet', modelo: 'S-10', placa: 'RNY-1A23', kmAtual: 89600, ano: 2023, renavam: '456123789', chassi: '9BD98765432109876', statusDispo: 'Em Manutenção' } }),
    prisma.veiculo.upsert({ where: { placa: 'NJK-5E92' }, update: {}, create: { prefixo: 'DC-04', marca: 'Chevrolet', modelo: 'S-10', placa: 'NJK-5E92', kmAtual: 32400, ano: 2022, renavam: '321654987', chassi: '9BD76543210987654', statusDispo: 'Disponível' } }),
    prisma.veiculo.upsert({ where: { placa: 'OBG-3C44' }, update: {}, create: { prefixo: 'DC-05', marca: 'Chevrolet', modelo: 'S-10', placa: 'OBG-3C44', kmAtual: 112000, ano: 2020, renavam: '789456123', chassi: '9BD43210987654321', statusDispo: 'Disponível' } }),
  ]);

  const motoristas = await Promise.all([
    prisma.motorista.upsert({ where: { cnh: '44589230591' }, update: {}, create: { nome: 'Carlos Alberto da Silva', cnh: '44589230591', categoria: 'D', telefone: '(65) 98756-3241', matricula: 'DC-4509' } }),
    prisma.motorista.upsert({ where: { cnh: '88950239401' }, update: {}, create: { nome: 'Marina Rodrigues', cnh: '88950239401', categoria: 'B', telefone: '(65) 94032-1188', matricula: 'DC-9923' } }),
    prisma.motorista.upsert({ where: { cnh: '55678129033' }, update: {}, create: { nome: 'José Roberto Souza', cnh: '55678129033', categoria: 'C', telefone: '(65) 97722-4411', matricula: 'DC-2104' } }),
  ]);

  console.log('Seed concluído.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
