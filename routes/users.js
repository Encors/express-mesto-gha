const router = require('express').Router();
const usersController = require('../controllers/users');

module.exports = router;

router.get('/', usersController.getUsers);

router.get('/:id', usersController.getUserById);

router.post('/', usersController.createUser);
