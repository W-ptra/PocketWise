function notFound(request, h) {
  const response = request.response;

  if (response.isBoom && response.output.statusCode === 404) {
    const output = response.output;
    output.headers["Access-Control-Allow-Origin"] = "*";
    output.headers["Access-Control-Allow-Headers"] =
      "Authorization, Content-Type";
    output.headers["Access-Control-Allow-Methods"] =
      "GET, POST, PUT, DELETE, OPTIONS";
    return h
      .response({
        error: `Path ${request.path} was not found`,
      })
      .code(404);
  }

  return h.continue;
}

module.exports = {
  notFound,
};
