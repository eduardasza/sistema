const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

function onlyAdmin(req, res, next) {
  if (!req.session.user || req.session.user.tipo !== 'admin') {
    req.flash('error', 'Acesso negado');
    return res.redirect('/login');
  }
  next();
}

router.get('/', async (req, res) => {
  const espacos = await prisma.espaco.findMany();
  res.render('espacos', { espacos });
});

router.get('/novo', onlyAdmin, (req, res) => {
  res.render('espaco_novo');
});

router.post('/novo', onlyAdmin, async (req, res) => {
  const { nome, tipo, capacidade, descricao } = req.body;

  await prisma.espaco.create({
    data: {
      nome,
      tipo,
      capacidade: Number(capacidade),
      descricao
    }
  });

  req.flash('success', 'Espaço criado');
  res.redirect('/espacos');
});

module.exports = router;

