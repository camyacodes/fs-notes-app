require('dotenv').config()
const { MongoMemoryServer } = require('mongodb-memory-server')

const PORT = process.env.PORT
let MONGODB_URI = ''

async function dbConnect() {
  // eslint-disable-next-line no-unused-vars
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 24880,
    },
  })
}

if (process.env.NODE_ENV === 'test') {
  dbConnect()
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else {
  MONGODB_URI = process.env.MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  PORT,
}
