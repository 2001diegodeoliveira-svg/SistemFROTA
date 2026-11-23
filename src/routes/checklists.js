const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get('/', async (req, res, next) => {
  try {
    const checklists = await prisma.checklist.findMany({
      include: { viagem: { include: { veiculo: true, motorista: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(checklists);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const c = await prisma.checklist.findUnique({
      where: { id: req.params.id },
      include: { viagem: { include: { veiculo: true, motorista: true } } },
    });
    if (!c) return res.status(404).json({ error: 'Checklist não encontrado' });
    res.json(c);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.checklist.create({
      data: {
        viagemId: data.viagemId ?? data.viagem_id,
        tipo: data.tipo,
        dataVistoria: data.dataVistoria ? new Date(data.dataVistoria) : (data.data_vistoria ? new Date(data.data_vistoria) : new Date()),
        ocupantes: data.ocupantes ?? null,
        farois: data.farois ?? null,
        setas: data.setas ?? null,
        luzFreio: data.luzFreio ?? data.luz_freio ?? null,
        giroflex: data.giroflex ?? null,
        sirene: data.sirene ?? null,
        radio: data.radio ?? null,
        limpadores: data.limpadores ?? null,
        cartaoPrime: data.cartaoPrime ?? data.cartao_prime ?? null,
        documento: data.documento ?? null,
        ferramentas: data.ferramentas ?? null,
        oleo: data.oleo ?? null,
        agua: data.agua ?? null,
        fluidoFreio: data.fluidoFreio ?? data.fluido_freio ?? null,
        combustivel: data.combustivel ?? null,
        arranhao: data.arranhao ?? null,
        amassado: data.amassado ?? null,
        quebrado: data.quebrado ?? null,
        avariasDesc: data.avariasDesc ?? data.avarias_desc ?? null,
        observacoes: data.observacoes ?? null,
        termo: data.termo ?? false,
        statusGeral: data.statusGeral ?? data.status_geral ?? 'Aprovado',
      },
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const data = req.body;
    const updated = await prisma.checklist.update({
      where: { id: req.params.id },
      data: {
        ...(data.tipo !== undefined && { tipo: data.tipo }),
        ...(data.dataVistoria !== undefined && { dataVistoria: new Date(data.dataVistoria) }),
        ...(data.data_vistoria !== undefined && { dataVistoria: new Date(data.data_vistoria) }),
        ...(data.ocupantes !== undefined && { ocupantes: data.ocupantes }),
        ...(data.farois !== undefined && { farois: data.farois }),
        ...(data.setas !== undefined && { setas: data.setas }),
        ...(data.luzFreio !== undefined && { luzFreio: data.luzFreio }),
        ...(data.luz_freio !== undefined && { luzFreio: data.luz_freio }),
        ...(data.giroflex !== undefined && { giroflex: data.giroflex }),
        ...(data.sirene !== undefined && { sirene: data.sirene }),
        ...(data.radio !== undefined && { radio: data.radio }),
        ...(data.limpadores !== undefined && { limpadores: data.limpadores }),
        ...(data.cartaoPrime !== undefined && { cartaoPrime: data.cartaoPrime }),
        ...(data.cartao_prime !== undefined && { cartaoPrime: data.cartao_prime }),
        ...(data.documento !== undefined && { documento: data.documento }),
        ...(data.ferramentas !== undefined && { ferramentas: data.ferramentas }),
        ...(data.oleo !== undefined && { oleo: data.oleo }),
        ...(data.agua !== undefined && { agua: data.agua }),
        ...(data.fluidoFreio !== undefined && { fluidoFreio: data.fluidoFreio }),
        ...(data.fluido_freio !== undefined && { fluidoFreio: data.fluido_freio }),
        ...(data.combustivel !== undefined && { combustivel: data.combustivel }),
        ...(data.arranhao !== undefined && { arranhao: data.arranhao }),
        ...(data.amassado !== undefined && { amassado: data.amassado }),
        ...(data.quebrado !== undefined && { quebrado: data.quebrado }),
        ...(data.avariasDesc !== undefined && { avariasDesc: data.avariasDesc }),
        ...(data.avarias_desc !== undefined && { avariasDesc: data.avarias_desc }),
        ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
        ...(data.termo !== undefined && { termo: data.termo }),
        ...(data.statusGeral !== undefined && { statusGeral: data.statusGeral }),
        ...(data.status_geral !== undefined && { statusGeral: data.status_geral }),
      },
    });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.checklist.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
