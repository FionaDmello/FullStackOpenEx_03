const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const entryModel = require("./models/entry");
const { application } = require("express");

//  data for the application
let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Fiona Poppendieck",
    number: "39-23-6423123",
  },
];


// initializing the server app
const server = express();

// cors handling
server.use(cors())

// need the following parser that allows easy access to request body that contains the post info
server.use(express.json())

// morgan token to display a POST requests body
morgan.token('body', function(req, res){
  return JSON.stringify(req.body)
});

// following logger used to log HTTP requests made to the server
server.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const generateRandomId = () => {
  return Math.floor(Math.random() * 10000)
}

// api definitions
server.get("/", (req, res) =>
  res.send("<h1>Hello! this is the server speaking...</h1>")
);

server.get("/info", (req, res) => {
  let timestamp = new Date();
  let day = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    timestamp
  );
  let month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    timestamp
  );
  let date = timestamp.getDate();
  let year = timestamp.getFullYear();
  let time = timestamp.toTimeString();

  res.send(
    `<div>Phonebook has info for ${data.length} people</div><div>${day} ${month} ${date} ${year} ${time}</div>`
  );
});

server.get("/api/persons", (req, res) => {
  return entryModel.find({})
  .then(dbRes => res.json(dbRes))
  .catch(err => console.log('Something went wrong while fetching all entries:',err))
  
});

server.post("/api/persons", (req, res) => {
  let body = req.body
  if(!body) {
    res.status(400).json({ error: 'content missing' })
  }
  else{
    // check if new entry can be created
    if (body.name && body.name!== undefined && body.name !== null && body.number && body.number !== undefined && body.number !== null) {
      if (data.map(o => o.name.toLowerCase()).includes(body.name.toLowerCase())) res.status(406).json({ error: `entry for ${body.name} already exists. name must be unique.`})
      else{
        const entry = new entryModel({...body })
        return entry.save()
        .then(dbRes => res.json(dbRes))
        .catch(err => console.log('Something went wrong while creating new entry:', err))
      }
    }
    else{
      res.status(400).json({ error: `request missing name or number required for entry creation.` })
    }
  } 
});

server.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  //  convert stringified id into a number before comparison    
  const entry = data.find((e) => e.id === Number(id));
  
  if (entry) res.json(entry);
  else res.status(404).end();
});

server.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  return entryModel.deleteOne({_id: id })
  .then(dbRes => {
    if(dbRes.deletedCount > 0) res.status(200).json({ message: `Successfully deleted entry for the phonebook.` })
    else res.status(404).json({ message: `Entry with id-${id} does not exist in the database` })
  })
  .catch(err => next(err))
})

// making the server listen to requests on a port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// error handling middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Invalid endpoint' })
}
server.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'Malformatted id' })
  }
  next(error)
}
server.use(errorHandler)
