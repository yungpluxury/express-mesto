const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send((cards));
    })
    .catch((cards, err) => {
      console.log(err);
      if (!cards) {
        return res.status(404).send({ message: 'Карточки не найдены' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
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
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card === null || undefined) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(200).send((card));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null || undefined) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(200).send((card));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null || undefined) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(200).send((card));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
