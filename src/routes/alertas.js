const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/', async (req, res, next) => {
  try {
    const alertas = await prisma.alerta.findMany({
      include: { veiculo: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(alertas);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { veiculoId, tipo, parametro, descricao } = req.body;
    const created = await prisma.alerta.create({
      data: { veiculoId, tipo, parametro: String(parametro), descricao: descricao ?? null },
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.alerta.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
