const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, addCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
  }),
}), addCard);
router.delete('/cards/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
