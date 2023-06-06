const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const signToken = (payload) => jwt.sign(payload, 'some-secret-key', { expiresIn: '7d' });

const checkToken = (token) => jwt.verify(token, 'some-secret-key');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = checkToken(token);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};

module.exports = { auth, signToken };