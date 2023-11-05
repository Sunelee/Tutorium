class ExtendableError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ExtendableError {
  constructor(message) {
    super(message || 'Bad Request', 400);
  }
}

class UnauthorizedError extends ExtendableError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

class ForbiddenError extends ExtendableError {
  constructor(message) {
    super(message || 'Forbidden', 403);
  }
}

class NotFoundError extends ExtendableError {
  constructor(message) {
    super(message || 'Not Found', 404);
  }
}

class UnprocessableEntityError extends ExtendableError {
  constructor(message) {
    super(message || 'Unprocessable Entity', 422);
  }
}

class InternalServerError extends ExtendableError {
  constructor(message) {
    super(message || 'Internal Server Error', 500);
  }
}

class UnauthenticatedError extends ExtendableError {
  constructor(message) {
    super(message || 'Unauthenticated', 401);
  }
}

module.exports = {
  ExtendableError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
  InternalServerError,
  UnauthenticatedError,
};
