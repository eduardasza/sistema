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


const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const espacosRoutes = require('./routes/espacos');
const reservasRoutes = require('./routes/reservas');

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/espacos', espacosRoutes);
app.use('/reservas', reservasRoutes);


app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect('/reservas');
});

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});
