const express = require('express')
const app = express()

app.use(express.json()) 

let   persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    date = new Date()
    res.send(`Phonebook has info for ${persons.length} people <br> ${date}`   )
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
  })

  app.post('/api/persons/', (req, res) => {
    const id = Math.floor(Math.random()*1000,0)
    const body = req.body
    
    if(body.name === "" || body.number === "" ){
        return res.status(400).json({ 
            error: 'Name and Number cannot be empty' 
        })
    }
    if (persons.some(person => person.name.toLocaleLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({ 
            error: 'Name must be Unique' 
        })
        }
        person = {...body,id:id}
        persons = persons.concat(person)
        res.json(persons)
    })


  app.delete('/api/persons/:id',(req,res)=> {
      const id = Number(req.params.id)
      const resPersons = persons.filter(person => person.id !== id)
      console.log(resPersons)
      res.status(204).end
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`PhoneBook Server running on port ${PORT}`)
  })