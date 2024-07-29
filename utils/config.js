require('dotenv').config()
// const { MongoMemoryServer } = require('mongodb-memory-server')

const PORT = process.env.PORT || 3001
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
// let MONGODB_URI = ''
// let mongod

// async function dbConnect() {
//   // eslint-disable-next-line no-unused-vars
//   mongod = await MongoMemoryServer.create({
//     instance: {
//       port: 24880,
//     },
//   })
// }

// if (process.env.NODE_ENV === 'test') {
//   dbConnect()
//   MONGODB_URI = process.env.TEST_MONGODB_URI
// } else {
//   MONGODB_URI = process.env.MONGODB_URI
// }

// async function stopDb() {
//   if (mongod) {
//     await mongod.stop()
//   }
// }

module.exports = {
  MONGODB_URI,
  PORT,
}
