function success(data, meta = {}, message = "OK", statusCode = 200) {
  return {
    message,
    data,
    meta: {
      statusCode,
      error: false,
      ...meta,
    },
  };
}

function error(message, statusCode = 500, errors = []) {
  return {
    message,
    code: statusCode,
    meta: {
      statusCode,
      error: true,
      errors,
    },
  };
}

module.exports = {
  success,
  error,
};
