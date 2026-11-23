const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/stats', async (req, res, next) => {
  try {
    const [total, disponivel, viagem, manutencao] = await Promise.all([
      prisma.veiculo.count(),
      prisma.veiculo.count({ where: { statusDispo: 'Disponível' } }),
      prisma.veiculo.count({ where: { statusDispo: 'Em Viagem' } }),
      prisma.veiculo.count({ where: { statusDispo: 'Em Manutenção' } }),
    ]);

    const manutencoes = await prisma.manutencao.findMany({ where: { status: 'Concluída' } });
    const totalPreventiva = manutencoes.filter(m => m.tipo === 'Preventiva').reduce((a, c) => a + c.custo, 0);
    const totalCorretiva = manutencoes.filter(m => m.tipo === 'Corretiva').reduce((a, c) => a + c.custo, 0);

    res.json({
      total,
      disponivel,
      viagem,
      manutencao,
      custos: {
        preventiva: totalPreventiva,
        corretiva: totalCorretiva,
        total: totalPreventiva + totalCorretiva,
      },
    });
  } catch (e) { next(e); }
});

module.exports = router;
