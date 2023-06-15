const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../errors/errors_constants');

// eslint-disable-next-line no-unused-vars
const handleErrors = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = handleErrors;
