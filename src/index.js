const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // <<< ADICIONAR

const app = express();
const port = process.env.PORT || 3000;

// --- VIEW ENGINE + LAYOUT ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);                 // <<< ATIVAR LAYOUTS
app.set('layout', 'layout');             // <<< DEFINIR layout.ejs COMO PADRÃO
// ---------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// middleware simples para expor infos às views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

// rotas
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const espacosRoutes = require('./routes/espacos');
const reservasRoutes = require('./routes/reservas');

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/espacos', espacosRoutes);
app.use('/reservas', reservasRoutes);

// rota inicial
app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect('/reservas');
});

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});
