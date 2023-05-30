const { HTTP_STATUS_NOT_FOUND } = require('./errors_constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
