const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const NotAuthError = require('../errors/notAuthError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send((users));
    })
    .catch((err) => {
      res.send(err);
    })
    .catch(next);
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null || undefined) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь по указанному _id не найден.');
      }
    })
    .catch(next);
};

const addUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
      if (err.code === 11000) {
        throw new ConflictError(`Пользователь с таким email: ${req.body.email} существует`);
      }
    })
    .catch(next);
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
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch(next);
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
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара.');
      }
    })
    .catch(next);
};

const login = (req, res) => {
  const { email } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      throw new NotAuthError(err.message);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  updateAvatar,
  login,
};
