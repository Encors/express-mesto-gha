const { HTTP_STATUS_CONFLICT } = require('./errors_constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
