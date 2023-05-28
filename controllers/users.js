const usersModel = require('../models/users');

const getUsers = (req, res) => {
  usersModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  usersModel
    .findById(req.params.userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  usersModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateProfile = (req, res) => {
  usersModel
    .findByIdAndUpdate(req.user._id, req.body, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateAvatar = (req, res) => {
  usersModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
