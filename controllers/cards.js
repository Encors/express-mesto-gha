const { default: mongoose } = require('mongoose');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const cardsModel = require('../models/cards');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await cardsModel.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};
const createCard = async (req, res, next) => {
  try {
    const card = await cardsModel.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user._id,
    });
    res.status(HTTP_STATUS_CREATED).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await cardsModel
      .findById(req.params.cardId)
      .orFail(new NotFoundError('Карточка не найдена'));

    const owner = card.owner.toString();
    if (req.user._id === owner) {
      const deletedCard = await cardsModel.deleteOne(card);
      res.status(HTTP_STATUS_OK).send(deletedCard);
    } else {
      next(new ForbiddenError('Чужую карточку удалить нельзя'));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await cardsModel
      .findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true },
      )
      .orFail(new NotFoundError('Карточка не найдена'));
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await cardsModel
      .findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true },
      )
      .orFail(new NotFoundError('Карточка не найдена'));
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
