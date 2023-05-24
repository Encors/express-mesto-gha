const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const users = [];

let id = 0;

app.get('/users', (req, res) => {
  res.send(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  return res.send(user);
});

app.post('/', (req, res) => {
  id += 1;

  console.log(req.body);

  const newUser = {
    ...req.body,
    id,
  };

  users.push(newUser);
  res.send(newUser);
});

app.listen(3000, () => {
  console.log('Aa');
});
