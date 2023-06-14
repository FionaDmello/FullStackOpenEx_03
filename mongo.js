require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
})

const Entry = mongoose.model('Entry', entrySchema)

const newEntry = new Entry({
    name: "Ada Lovelace",
    number: "39-44-5323523",
  })

newEntry.save().then(dbRes => {
    console.log('Entry saved!', dbRes)
    mongoose.connection.close()
})