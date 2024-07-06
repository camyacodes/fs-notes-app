const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformed id' })
  }
  if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message })
  }
  // if error is not a casterror it is passed to next errorhandler function, in this case the express built in error handler
  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

// Find note by ID
app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note)
      } else {
        // With this, promise is fufilled but returns null bc id doesnt exist, we catch it
        response.status(404).end()
      }
    })
    .catch((error) => {
      //with this promise is rejected, there is no response, we catch it
      next(error)
    })
})

// Create new note
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  })
  note
    .save()
    .then((savedNote) => {
      response.json(savedNote)
    })
    .catch((error) => next(error))
})

// Change existing note
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => next(error))
})

// delete note
app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then((note) => {
      response.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})

// catches undefined routes, req is not being handled by any routes and so bypasses everything to the next middleware which is this
app.use(unknownEndpoint)

// Catches error that is passed to next function within a req function which handles error using our custom error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
