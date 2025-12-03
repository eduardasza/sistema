const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

function ensureAuth(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Faça login primeiro');
    return res.redirect('/login');
  }
  next();
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return (aStart < bEnd) && (bStart < aEnd);
}


router.get('/', ensureAuth, async (req, res) => {
  const { month, year } = req.query;
  const reservas = await prisma.reserva.findMany({ include: { espaco: true, usuario: true }});
  const espacos = await prisma.espaco.findMany();
  res.render('reservas', { reservas, espacos });
});

router.get('/novo', ensureAuth, async (req, res) => {
  const espacos = await prisma.espaco.findMany();
  res.render('reserva_nova', { espacos });
});

router.post('/novo', ensureAuth, async (req, res) => {
  const usuarioId = req.session.user.id;
  const { espacoId, dataReserva, horaInicio, horaFim } = req.body;

  const inicio = horaInicio;
  const fim = horaFim;
  const conflitos = await prisma.reserva.findMany({
    where: {
      espacoId: Number(espacoId),
      dataReserva: new Date(dataReserva),
      status: 'ativa'
    }
  });

  for (const c of conflitos) {
    if (overlaps(inicio, fim, c.horaInicio, c.horaFim)) {
      req.flash('error', 'Horário em conflito com outra reserva');
      return res.redirect('/reservas/novo');
    }
  }
  await prisma.reserva.create({
    data: {
      usuarioId: Number(usuarioId),
      espacoId: Number(espacoId),
      dataReserva: new Date(dataReserva),
      horaInicio: inicio,
      horaFim: fim
    }
  });
  req.flash('success', 'Reserva criada');
  res.redirect('/reservas');
});

router.post('/:id/cancelar', ensureAuth, async (req, res) => {
  const id = Number(req.params.id);
  const reserva = await prisma.reserva.findUnique({ where: { id }});
  if (!reserva) {
    req.flash('error', 'Reserva não encontrada');
    return res.redirect('/reservas');
  }

  if (req.session.user.tipo !== 'admin' && req.session.user.id !== reserva.usuarioId) {
    req.flash('error', 'Acesso negado');
    return res.redirect('/reservas');
  }
  await prisma.reserva.update({ where: { id }, data: { status: 'cancelada' }});
  req.flash('success', 'Reserva cancelada');
  res.redirect('/reservas');
});

module.exports = router;
