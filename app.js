const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

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
app.listen(3000, () => {});
