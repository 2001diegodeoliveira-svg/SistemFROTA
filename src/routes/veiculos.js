const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const { z } = require('zod');

const veiculoSchema = z.object({
  prefixo: z.string().min(1),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  placa: z.string().min(1),
  kmAtual: z.number().int().nonnegative().optional(),
  km_atual: z.number().int().nonnegative().optional(),
  ano: z.number().int(),
  renavam: z.string().optional().nullable(),
  chassi: z.string().optional().nullable(),
  statusDispo: z.string().optional(),
  status_dispo: z.string().optional(),
});

// GET all
router.get('/', async (req, res, next) => {
  try {
    const veiculos = await prisma.veiculo.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(veiculos);
  } catch (e) { next(e); }
});

// GET by id
router.get('/:id', async (req, res, next) => {
  try {
    const v = await prisma.veiculo.findUnique({ where: { id: req.params.id } });
    if (!v) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.json(v);
  } catch (e) { next(e); }
});

// POST create
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const km = data.kmAtual ?? data.km_atual ?? 0;
    const status = data.statusDispo ?? data.status_dispo ?? 'Disponível';
    const created = await prisma.veiculo.create({
      data: {
        prefixo: data.prefixo,
        marca: data.marca,
        modelo: data.modelo,
        placa: data.placa.toUpperCase(),
        kmAtual: km,
        ano: data.ano,
        renavam: data.renavam ?? null,
        chassi: data.chassi ?? null,
        statusDispo: status,
      },
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// PUT update
router.put('/:id', async (req, res, next) => {
  try {
    const data = req.body;
    const km = data.kmAtual ?? data.km_atual;
    const status = data.statusDispo ?? data.status_dispo;
    const updated = await prisma.veiculo.update({
      where: { id: req.params.id },
      data: {
        ...(data.prefixo !== undefined && { prefixo: data.prefixo }),
        ...(data.marca !== undefined && { marca: data.marca }),
        ...(data.modelo !== undefined && { modelo: data.modelo }),
        ...(data.placa !== undefined && { placa: data.placa.toUpperCase() }),
        ...(km !== undefined && { kmAtual: km }),
        ...(data.ano !== undefined && { ano: data.ano }),
        ...(data.renavam !== undefined && { renavam: data.renavam }),
        ...(data.chassi !== undefined && { chassi: data.chassi }),
        ...(status !== undefined && { statusDispo: status }),
      },
    });
    res.json(updated);
  } catch (e) { next(e); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.veiculo.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
