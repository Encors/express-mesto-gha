/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const app = express();
app.use(router);
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Aa');
});
