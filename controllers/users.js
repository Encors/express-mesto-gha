const { default: mongoose } = require('mongoose');
const usersModel = require('../models/users');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = async (req, res, next) => {
  try {
    const users = await usersModel
      .find({})
      .orFail(new BadRequestError('Переданы некорректные данные'));
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await usersModel
      .findById(req.params.userId)
      .orFail(new NotFoundError('Пользователь не найден'));
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await usersModel.create(req.body);
    res.status(201).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await usersModel
      .findByIdAndUpdate(req.user._id, req.body, {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      })
      .orFail(new NotFoundError('Пользователь не найден'));
    res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const user = await usersModel
      .findByIdAndUpdate(
        req.user._id,
        { avatar: req.body.avatar },
        {
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
        },
      )
      .orFail(new NotFoundError('Пользователь не найден'));
    res.status(200).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
