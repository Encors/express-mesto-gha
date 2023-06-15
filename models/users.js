const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail, isURL } = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: [isURL, 'Неправильный формат ссылки'],
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Некорректный email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email })
    .select('+password')
    .orFail(new UnauthorizedError('Неправильные почта или пароль'));
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return Promise.reject(
      new UnauthorizedError('Неправильные почта или пароль'),
    );
  }
  return user;
};

module.exports = mongoose.model('user', userSchema);
