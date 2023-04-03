const express = require("express");

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
];
// initializing the server app
const server = express();

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

server.get("/api/persons", (req, res) => res.json(data));

server.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  //  convert stringified id into a number before comparison    
  const entry = data.find((e) => e.id === Number(id));
  
  if (entry) res.json(entry);
  else res.status(404).end();
});


// making the server listen to requests on a port
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
