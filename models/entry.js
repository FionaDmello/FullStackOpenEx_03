require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
.then(res => console.timeLog('Successfully connected to DB', res))
.catch(err => console.log('Encountered problem while connecting to DB', err))

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3,'Name must have at least 3 characters'],
        required: [true, 'Phone number is required']
    },
    number: {
        type: String,
        minLength: [8, 'Phone number must have at least 8 digits'],
        required: [true, 'Phone number is required'],
        validate: {
            validator: (v) => {
                return /^\d{2,3}-\d{7,8}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    }
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
