const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

// middleware simples de verificação de admin
function onlyAdmin(req, res, next) {
  if (!req.session.user || req.session.user.tipo !== 'admin') {
    req.flash('error', 'Acesso negado: administrador');
    return res.redirect('/login');
  }
  next();
}

router.get('/usuarios', onlyAdmin, async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.render('usuarios', { usuarios });
});

router.get('/usuarios/novo', onlyAdmin, (req, res) => {
  res.render('usuario_novo');
});

router.post('/usuarios/novo', onlyAdmin, async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  const hashed = await bcrypt.hash(senha, 10);
  await prisma.usuario.create({
    data: { nome, email, senha: hashed, tipo }
  });
  req.flash('success', 'Usuário criado');
  res.redirect('/admin/usuarios');
});

router.post('/usuarios/:id/bloquear', onlyAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.usuario.update({ where: { id }, data: { tipo: 'bloqueado' }});
  req.flash('success', 'Usuário bloqueado');
  res.redirect('/admin/usuarios');
});

module.exports = router;
