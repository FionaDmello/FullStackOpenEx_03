require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
.then(res => console.timeLog('Successfully connected to DB', res))
.catch(err => console.log('Encountered problem while connecting to DB', err))

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
})

entrySchema.set('toJSON', {
    transform: (doc, returnedDoc) => {
        returnedDoc.id = returnedDoc._id.toString()
        delete returnedDoc._id
        delete returnedDoc.__v
    }
})

const Entry =  new mongoose.model('Entry', entrySchema)

module.exports = Entry
