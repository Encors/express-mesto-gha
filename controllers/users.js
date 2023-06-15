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

const findUser = async (id) => {
  const user = await usersModel
    .findById(id)
    .orFail(new NotFoundError('Пользователь не найден'));
  return user;
};

const getUserById = async (req, res, next) => {
  try {
    const user = await findUser(req.params.userId);
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await findUser(req.user._id);
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    next(err);
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
    res.status(HTTP_STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    });
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

const updateData = async (id, data) => {
  const user = await usersModel
    .findByIdAndUpdate(id, data, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    })
    .orFail(new NotFoundError('Пользователь не найден'));
  return user;
};

// функция-декоратор
const updateProfile = async (req, res, next) => {
  try {
    const user = await updateData(req.user._id, req.body);
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

// функция-декоратор
const updateAvatar = async (req, res, next) => {
  try {
    const user = await updateData(req.user._id, { avatar: req.body.avatar });
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
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  loginUser,
};
