export class CustomError extends Error {
  constructor(statusCode, message, errors) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

export const errorHandler = (err, req, res) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({
      status: "error",
      error: err.message,
      errors: err.errors,
    });
  } else if (err.status) {
    res.status(err.status).json({
      status: "error",
      error: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: "Internal server error",
    });
  }
};
