const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

// login action
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = await prisma.usuario.findUnique({ where: { email }});
  if (!user) {
    req.flash('error', 'Usuário não encontrado');
    return res.redirect('/login');
  }
  const match = await bcrypt.compare(senha, user.senha);
  if (!match) {
    req.flash('error', 'Senha inválida');
    return res.redirect('/login');
  }
  if (user.tipo === 'bloqueado') {
    req.flash('error', 'Usuário bloqueado');
    return res.redirect('/login');
  }
  req.session.user = { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo };
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
