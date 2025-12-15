const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

function ensureAuth(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Faça login');
    return res.redirect('/login');
  }
  next();
}

router.get('/', ensureAuth, async (req, res) => {
  const reservas = await prisma.reserva.findMany({
    include: {
      espaco: true,
      usuario: true
    }
  });

  res.render('reservas', {
    reservas,
    user: req.session.user
  });
});

router.get('/novo', ensureAuth, async (req, res) => {
  const espacos = await prisma.espaco.findMany();
  res.render('reserva_nova', {
    espacos,
    user: req.session.user
  });
});


router.post('/novo', ensureAuth, async (req, res) => {
  const { espacoId, dataReserva, horaInicio, horaFim } = req.body;

  try {
    await prisma.reserva.create({
      data: {
        usuarioId: req.session.user.id,
        espacoId: Number(espacoId),
        dataReserva: new Date(dataReserva),
        horaInicio,
        horaFim
      }
    });

    req.flash('success', 'Reserva criada com sucesso');
    res.redirect('/reservas');

  } catch (error) {
    req.flash(
      'error',
      'Essa sala já está reservada nesse dia e horário'
    );
    res.redirect('/reservas/novo');
  }
});


router.post('/:id/cancelar', ensureAuth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.reserva.update({
    where: { id },
    data: { status: 'cancelada' }
  });

  req.flash('success', 'Reserva cancelada');
  res.redirect('/reservas');
});

module.exports = router;
