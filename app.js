const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });
const express = require('express');
const app = express();
const logger = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
app.use(cors());

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tensorflowRouter = require('./routes/tensorflow');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/tensorflows', tensorflowRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
