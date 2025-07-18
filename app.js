var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');


var usersRouter = require('./routes/users');

const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/profile');
const stockRouter = require('./routes/stock');
const donacionesRouter = require('./routes/donaciones');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//Session
app.use(session({
  secret: 'Dona',
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  if(req.session.user !== undefined){
    res.locals.user = req.session.user

    console.log(req.session.user);
    console.log(res.locals.user);
  }
  return next();
});

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/stock', stockRouter)
app.use('/profile', usuariosRouter)
app.use('/donaciones', donacionesRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const db = require('./database/models');

db.sequelize.sync()
  .then(() => {
    console.log("✅ Tablas sincronizadas (sin borrar datos)");
  })
  .catch((err) => {
    console.error("❌ Error al sincronizar:", err);
  });

module.exports = app;


// Levantamos servidor
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
