const express = require('express');
const serverless = require("serverless-http");

require('dotenv').config();

const { DB } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');
const NotFoundError = require('./errors/notFoundError');

const app = express();

mongoose.connect(DB);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(cors);

app.use(requestLogger);

app.post('/.netlify/functions/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).max(30),
    }),
  }),
  login);
app.post('/.netlify/functions/api/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
        .pattern(new RegExp('^[A-Za-z0-9]{8,30}$')),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .regex(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
    }),
  }),
  addUser);

app.use(auth);

app.use('/.netlify/functions/api', cardsRoutes);
app.use('/.netlify/functions/api', usersRoutes);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});


module.exports = app;
module.exports.handler = serverless(app);