const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send((cards));
    })
    .catch((cards, err) => {
      console.log(err);
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }
    })
    .catch(next);
};

const addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send((card));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const id = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      if (card.owner.toString() !== id) {
        throw new ForbiddenError('Нет прав для удаления карточки.');
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          })
          .catch(next);
      }
    })
    .catch(next);
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null || undefined) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      return res.status(200).send((card));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null || undefined) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      return res.status(200).send((card));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
