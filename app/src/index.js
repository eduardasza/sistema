const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

app.use('/', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/espacos', require('./routes/espacos'));
app.use('/reservas', require('./routes/reservas'));

app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect('/reservas');
});

app.listen(port, () => {
  console.log(`Rodando em http://localhost:${port}`);
});
