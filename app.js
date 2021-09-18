const express = require('express');

require('dotenv').config();

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');
const notFoundRouter = require('./routes/notFound');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', addUser);

app.use(auth);

app.use('/', cardsRoutes);
app.use('/', usersRoutes);

app.all('*', notFoundRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
