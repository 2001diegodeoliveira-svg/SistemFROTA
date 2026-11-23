const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const veiculosRoutes = require('./routes/veiculos');
const motoristasRoutes = require('./routes/motoristas');
const viagensRoutes = require('./routes/viagens');
const checklistsRoutes = require('./routes/checklists');
const manutencoesRoutes = require('./routes/manutencoes');
const alertasRoutes = require('./routes/alertas');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// API
app.use('/api/veiculos', veiculosRoutes);
app.use('/api/motoristas', motoristasRoutes);
app.use('/api/viagens', viagensRoutes);
app.use('/api/checklists', checklistsRoutes);
app.use('/api/manutencoes', manutencoesRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir frontend estático (gestaodefrota.html)
app.use(express.static(path.join(__dirname, '..')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'gestaodefrota.html'));
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

module.exports = app;
