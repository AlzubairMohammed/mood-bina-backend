class ErrorResponse extends Error {
  constructor(message, stateCode) {
    super(message);
    this.stateCode = stateCode;
  }
}

module.exports = ErrorResponse;
