require('dotenv').config()
const mongoose = require('mongoose')

// const url = process.env.MONGO_URI
let password = process.argv[2]
const url = `mongodb+srv://test_user:${password}@part3cluster.wu9vu8t.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
})

const Entry = mongoose.model('Entry', entrySchema)

let name = (process.argv[3] && process.argv[3] !== undefined && process.argv[3] !== null) ? process.argv[3] : null
let number = (process.argv[4] && process.argv[4] !== undefined && process.argv[4] !== null) ? process.argv[4] : null

if(name && number) {
    const newEntry = new Entry({ name, number})

    newEntry.save().then(dbRes => {
        console.log('Entry saved!', dbRes)
        mongoose.connection.close()
    })
}
else {
    Entry.find({}).then(dbRes => {
        console.log(`phonebook:`)
        dbRes.map(document => console.log(`${document.name} ${document.number}`))
        mongoose.connection.close()
    })
}

