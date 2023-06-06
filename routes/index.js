const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const usersController = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const {
  validateUserBody,
  validateUserAvatar,
} = require('../middlewares/validate');

router.post(
  '/signup',
  validateUserBody,
  validateUserAvatar,
  usersController.createUser,
);
router.post('/signin', validateUserBody, usersController.loginUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

module.exports = router;
