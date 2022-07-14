const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });
const express = require('express');
const app = express();
const createError = require('http-errors');
const cors = require('cors');

const indexRouter = require('./routes/index');
const tensorflowRouter = require('./routes/tensorflow');

app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
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
