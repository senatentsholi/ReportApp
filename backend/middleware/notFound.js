function notFound(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.originalUrl}`,
  });
}

module.exports = { notFound };
