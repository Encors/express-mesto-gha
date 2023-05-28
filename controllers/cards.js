const cardsModel = require('../models/cards');

const getCards = (req, res) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  cardsModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const deleteCard = (req, res) => {
  cardsModel
    .findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
      err: err.message,
      stack: err.stack,
    }));
};

const likeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
      err: err.message,
      stack: err.stack,
    }));
};

const dislikeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
      err: err.message,
      stack: err.stack,
    }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
