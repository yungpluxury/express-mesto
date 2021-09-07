const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send((users));
    })
    .catch((users, err) => {
      console.log(err);
      if (users === null || undefined) {
        return res.status(500).send({ message: 'Пользователи отсутсвуют.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null || undefined) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send((user));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(200).send((user));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(200).send((user));
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  updateAvatar,
};
