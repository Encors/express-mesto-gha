const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index');
const handleErrors = require('./middlewares/handleErrors');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter);

app.use(express.json());

app.use(helmet());
app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(handleErrors);
module.exports = app;
