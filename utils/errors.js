function NotFoundError(message, statusCode = 404) {
  const error = new Error(message || "Resource not found");
  error.statusCode = statusCode;

  return error;
}

function BadRequest(message, statusCode = 400) {
  const error = new Error(message || "Resource not found");
  error.statusCode = statusCode;

  return error;
}

module.exports = {
  NotFoundError,
  BadRequest,
};
