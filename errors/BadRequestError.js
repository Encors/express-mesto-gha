const { HTTP_STATUS_BAD_REQUEST } = require('./errors_constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
