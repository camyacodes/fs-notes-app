const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongo = null

const connectDB = async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()

  await mongoose.connect(uri)
  console.log('Now connected on to MongoDB on', uri)
}

const dropDB = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongo.stop()
  }
}

const dropCollections = async () => {
  if (mongo) {
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
      await collection.drop()
    }
  }
}

module.exports = { connectDB, dropDB, dropCollections }
