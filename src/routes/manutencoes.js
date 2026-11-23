const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/', async (req, res, next) => {
  try {
    const manutencoes = await prisma.manutencao.findMany({
      include: { veiculo: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(manutencoes);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const m = await prisma.manutencao.findUnique({
      where: { id: req.params.id },
      include: { veiculo: true },
    });
    if (!m) return res.status(404).json({ error: 'Manutenção não encontrada' });
    res.json(m);
  } catch (e) { next(e); }
});

// Entrada em manutenção
router.post('/entrada', async (req, res, next) => {
  try {
    const { veiculoId, tipo, kmRegistro, km_registro, oficina, pecas, diagnostico, dataEntrada, data_entrada } = req.body;
    const veic = await prisma.veiculo.findUnique({ where: { id: veiculoId } });
    if (!veic) return res.status(404).json({ error: 'Veículo não encontrado' });
    if (veic.statusDispo !== 'Disponível') return res.status(400).json({ error: 'Veículo não está disponível' });

    const km = Number(kmRegistro ?? km_registro);
    if (km < veic.kmAtual) return res.status(400).json({ error: `KM menor que KM atual (${veic.kmAtual})` });

    const manut = await prisma.manutencao.create({
      data: {
        veiculoId,
        tipo: tipo ?? 'Corretiva',
        custo: 0,
        pecas: pecas ?? diagnostico ?? '',
        oficina,
        kmRegistro: km,
        dataEntrada: dataEntrada ? new Date(dataEntrada) : (data_entrada ? new Date(data_entrada) : new Date()),
        status: 'Ativa',
      },
    });

    await prisma.veiculo.update({
      where: { id: veiculoId },
      data: { statusDispo: 'Em Manutenção', kmAtual: km },
    });

    res.status(201).json(manut);
  } catch (e) { next(e); }
});

// Saída de manutenção
router.post('/saida', async (req, res, next) => {
  try {
    const { manutencaoId, kmFinal, km_final, custo, dataSaida, data_saida, servicos } = req.body;
    const m = await prisma.manutencao.findUnique({ where: { id: manutencaoId } });
    if (!m) return res.status(404).json({ error: 'Manutenção não encontrada' });
    if (m.status !== 'Ativa') return res.status(400).json({ error: 'Manutenção não está ativa' });

    const km = Number(kmFinal ?? km_final);
    if (km < m.kmRegistro) return res.status(400).json({ error: `KM de saída menor que entrada (${m.kmRegistro})` });

    const updated = await prisma.manutencao.update({
      where: { id: manutencaoId },
      data: {
        custo: custo !== undefined ? Number(custo) : m.custo,
        dataSaida: dataSaida ? new Date(dataSaida) : (data_saida ? new Date(data_saida) : new Date()),
        pecas: servicos ?? m.pecas,
        status: 'Concluída',
      },
    });

    await prisma.veiculo.update({
      where: { id: m.veiculoId },
      data: { statusDispo: 'Disponível', kmAtual: km },
    });

    res.json(updated);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const data = req.body;
    const km = data.kmRegistro ?? data.km_registro;
    const updated = await prisma.manutencao.update({
      where: { id: req.params.id },
      data: {
        ...(data.tipo !== undefined && { tipo: data.tipo }),
        ...(km !== undefined && { kmRegistro: Number(km) }),
        ...(data.oficina !== undefined && { oficina: data.oficina }),
        ...(data.pecas !== undefined && { pecas: data.pecas }),
        ...(data.custo !== undefined && { custo: Number(data.custo) }),
        ...(data.dataEntrada !== undefined && { dataEntrada: new Date(data.dataEntrada) }),
        ...(data.data_entrada !== undefined && { dataEntrada: new Date(data.data_entrada) }),
        ...(data.dataSaida !== undefined && { dataSaida: data.dataSaida ? new Date(data.dataSaida) : null }),
        ...(data.data_saida !== undefined && { dataSaida: data.data_saida ? new Date(data.data_saida) : null }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    if (data.status) {
      const m = await prisma.manutencao.findUnique({ where: { id: req.params.id } });
      if (m) {
        if (data.status === 'Ativa') await prisma.veiculo.update({ where: { id: m.veiculoId }, data: { statusDispo: 'Em Manutenção' } });
        if (data.status === 'Concluída') await prisma.veiculo.update({ where: { id: m.veiculoId }, data: { statusDispo: 'Disponível' } });
      }
    }

    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const m = await prisma.manutencao.findUnique({ where: { id: req.params.id } });
    if (m && m.status === 'Ativa') {
      await prisma.veiculo.update({ where: { id: m.veiculoId }, data: { statusDispo: 'Disponível' } });
    }
    await prisma.manutencao.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
