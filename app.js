const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const handleErrors = require('./middlewares/handleErrors');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6470bf08b9c96425c7a57e6e',
  };

  next();
});

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(handleErrors);
app.listen(3000, () => {});
