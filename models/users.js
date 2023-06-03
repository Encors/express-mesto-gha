const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
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
