const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/', async (req, res, next) => {
  try {
    const viagens = await prisma.viagem.findMany({
      include: { veiculo: true, motorista: true, checklists: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(viagens);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const v = await prisma.viagem.findUnique({
      where: { id: req.params.id },
      include: { veiculo: true, motorista: true, checklists: true },
    });
    if (!v) return res.status(404).json({ error: 'Viagem não encontrada' });
    res.json(v);
  } catch (e) { next(e); }
});

// Criar saída (inicia viagem Ativa)
router.post('/saida', async (req, res, next) => {
  try {
    const { veiculoId, motoristaId, kmInicial, destino, dataSaida } = req.body;
    const veic = await prisma.veiculo.findUnique({ where: { id: veiculoId } });
    if (!veic) return res.status(404).json({ error: 'Veículo não encontrado' });
    if (veic.statusDispo !== 'Disponível') return res.status(400).json({ error: 'Veículo não está disponível' });

    const km = Number(kmInicial);
    if (km < veic.kmAtual) return res.status(400).json({ error: `KM inicial menor que KM atual (${veic.kmAtual})` });

    const viagem = await prisma.viagem.create({
      data: {
        veiculoId,
        motoristaId,
        dataSaida: dataSaida ? new Date(dataSaida) : new Date(),
        kmInicial: km,
        destino,
        status: 'Ativa',
      },
    });

    await prisma.veiculo.update({
      where: { id: veiculoId },
      data: { statusDispo: 'Em Viagem', kmAtual: km },
    });

    res.status(201).json(viagem);
  } catch (e) { next(e); }
});

// Registrar retorno (conclui viagem)
router.post('/retorno', async (req, res, next) => {
  try {
    const { viagemId, kmFinal, dataRetorno } = req.body;
    const v = await prisma.viagem.findUnique({ where: { id: viagemId } });
    if (!v) return res.status(404).json({ error: 'Viagem não encontrada' });
    if (v.status !== 'Ativa') return res.status(400).json({ error: 'Viagem não está ativa' });

    const km = Number(kmFinal);
    if (km < v.kmInicial) return res.status(400).json({ error: `KM final menor que KM inicial (${v.kmInicial})` });

    const updated = await prisma.viagem.update({
      where: { id: viagemId },
      data: {
        dataRetorno: dataRetorno ? new Date(dataRetorno) : new Date(),
        kmFinal: km,
        status: 'Concluída',
      },
    });

    await prisma.veiculo.update({
      where: { id: v.veiculoId },
      data: { statusDispo: 'Disponível', kmAtual: km },
    });

    res.json(updated);
  } catch (e) { next(e); }
});

// Update genérico
router.put('/:id', async (req, res, next) => {
  try {
    const data = req.body;
    const updated = await prisma.viagem.update({
      where: { id: req.params.id },
      data: {
        ...(data.destino !== undefined && { destino: data.destino }),
        ...(data.dataSaida !== undefined && { dataSaida: new Date(data.dataSaida) }),
        ...(data.data_saida !== undefined && { dataSaida: new Date(data.data_saida) }),
        ...(data.dataRetorno !== undefined && { dataRetorno: data.dataRetorno ? new Date(data.dataRetorno) : null }),
        ...(data.data_retorno !== undefined && { dataRetorno: data.data_retorno ? new Date(data.data_retorno) : null }),
        ...(data.kmInicial !== undefined && { kmInicial: Number(data.kmInicial) }),
        ...(data.km_inicial !== undefined && { kmInicial: Number(data.km_inicial) }),
        ...(data.kmFinal !== undefined && { kmFinal: data.kmFinal !== null ? Number(data.kmFinal) : null }),
        ...(data.km_final !== undefined && { kmFinal: data.km_final !== null ? Number(data.km_final) : null }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });

    // sincroniza status do veículo se fornecido
    if (data.status) {
      const v = await prisma.viagem.findUnique({ where: { id: req.params.id } });
      const veic = await prisma.veiculo.findUnique({ where: { id: v.veiculoId } });
      if (veic) {
        if (data.status === 'Ativa') await prisma.veiculo.update({ where: { id: v.veiculoId }, data: { statusDispo: 'Em Viagem' } });
        if (data.status === 'Concluída') await prisma.veiculo.update({ where: { id: v.veiculoId }, data: { statusDispo: 'Disponível' } });
      }
    }

    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const v = await prisma.viagem.findUnique({ where: { id: req.params.id } });
    if (v && v.status === 'Ativa') {
      await prisma.veiculo.update({ where: { id: v.veiculoId }, data: { statusDispo: 'Disponível' } });
    }
    await prisma.viagem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
