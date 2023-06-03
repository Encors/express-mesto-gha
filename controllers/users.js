const { default: mongoose } = require('mongoose');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const bcrypt = require('bcrypt');
const { signToken } = require('../middlewares/auth');
const usersModel = require('../models/users');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const DUPLICATE_KEY_ERROR = 11000;

const getUsers = async (req, res, next) => {
  try {
    const users = await usersModel.find({});
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
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await usersModel.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
    res.status(HTTP_STATUS_CREATED).send({ _id: user._id, email: user.email });
  } catch (err) {
    if (err.code === DUPLICATE_KEY_ERROR) {
      next(new ConflictError('Такой пользователь уже существует'));
    } else if (err instanceof mongoose.Error.ValidationError) {
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
    res.status(HTTP_STATUS_OK).send(user);
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
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findUserByCredentials(email, password);

    const token = signToken({ _id: user._id });
    res.send({ token });
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
  loginUser,
};
