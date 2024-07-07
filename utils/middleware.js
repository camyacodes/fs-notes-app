const logger = require('./logger')
var morgan = require('morgan')

// Add the morgan middleware to your application for logging.
// Configure it to log messages to your console based on the tiny configuration.

// eslint-disable-next-line no-unused-vars
morgan.token('content', function (request, response) {
  return JSON.stringify(request.body)
})

const morganLog = morgan(
  ':method :url :status :res[content-length] - :response-time ms :content'
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  morganLog,
  unknownEndpoint,
  errorHandler,
}
