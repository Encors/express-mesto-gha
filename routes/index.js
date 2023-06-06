const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const usersController = require('../controllers/users');
const { auth } = require('../middlewares/auth');
// const validateUserBody = require('../middlewares/validate');

router.post('/signup', usersController.createUser);
router.post('/signin', usersController.loginUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

module.exports = router;
