const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/', async (req, res, next) => {
  try {
    const motoristas = await prisma.motorista.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(motoristas);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const m = await prisma.motorista.findUnique({ where: { id: req.params.id } });
    if (!m) return res.status(404).json({ error: 'Motorista não encontrado' });
    res.json(m);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.motorista.create({
      data: {
        nome: data.nome,
        cnh: data.cnh,
        categoria: data.categoria ?? data.categoria_cnh,
        telefone: data.telefone ?? null,
        matricula: data.matricula,
      },
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const data = req.body;
    const updated = await prisma.motorista.update({
      where: { id: req.params.id },
      data: {
        ...(data.nome !== undefined && { nome: data.nome }),
        ...(data.cnh !== undefined && { cnh: data.cnh }),
        ...(data.categoria !== undefined && { categoria: data.categoria }),
        ...(data.categoria_cnh !== undefined && { categoria: data.categoria_cnh }),
        ...(data.telefone !== undefined && { telefone: data.telefone }),
        ...(data.matricula !== undefined && { matricula: data.matricula }),
      },
    });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.motorista.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
