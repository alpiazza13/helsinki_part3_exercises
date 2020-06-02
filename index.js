const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
morgan.token("body", req => JSON.stringify(req.body))
app.use(morgan(":body"))

let persons = [
  {
    name: "Jake Faigle",
    number: "914-293-0943",
    id: 1
  },
  {
    name: "Dirty Luks",
    number: "914-098-0213",
    id: 2
  },
  {
    name: "Christopher Boncardo",
    number: "914-923-1874",
    id: 3
  }
]
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
    const message = `The phonebook has ${persons.length} people`
    const date = new Date()
    response.send(`<p>The phonebook has ${persons.length} people</p>
                   <p>${date.toString()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = {
    name: body.content,
    number: body.number,
    id: generateId(1, 100000),
  }

  const namesOnly = persons.map(person => person.name)
  if (namesOnly.includes(person.name)) {
      return response.status(400).json({
        error: 'this person is eady in the phonebook'
      })
  }

  persons = persons.concat(person)
  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
