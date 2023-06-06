const router = require('express').Router();
const usersController = require('../controllers/users');
const {
  validateUserBody,
  validateUserAvatar,
  validateUserId,
} = require('../middlewares/validate');

router.get('/', usersController.getUsers);

router.get('/me', usersController.getUser);

router.get('/:userId', validateUserId, usersController.getUserById);

router.patch('/me', validateUserBody, usersController.updateProfile);

router.patch('/me/avatar', validateUserAvatar, usersController.updateAvatar);

module.exports = router;
