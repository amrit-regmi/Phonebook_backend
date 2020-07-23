require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json()) 


const morgan = require('morgan')
morgan.token('params', function(req, res, param) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status  :res[content-length]  :response-time ms :params[id]' ));

const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

const Person = require('./models/person')
const { response } = require('express')


/*let   persons = [
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
  ]*/
  
  //PUT REQUEST 
  app.put('/api/persons/:id',(req,res,next) =>{
    const body = req.body
    const person={
      number: body.number,
      name: body.name
    }
    
    Person.findByIdAndUpdate(req.params.id,person,{new:true, runValidators: true})
      .then(updatedPerson=>{
        console.log(updatedPerson)
        res.json(updatedPerson)
      }).catch(error => next(error))

  })

  //GET LIST OF PERSONS
  app.get('/api/persons', (req, res,next) => {
    Person.find({}).then(results=>{
      res.json(results)
    }).catch(error => next(error))
  })

  //GET SUMMARY OF DATABASE
  app.get('/info', (req, res,next) => {
    date = new Date()
    Person.find({}).then(results=>{
      res.send(`Phonebook has info for ${results.length} people <br> ${date}`   )
    }).catch(error => next(error))
    
  })

  //GET INDIVIDUAL PERSON
  app.get('/api/persons/:id', (req, res,next) => {
   /* const id = Number(req.params.id)*/
    Person.findById(req.params.id).then(person=>{
      res.json(person)
    }).catch(error => next(error))
  })

  //POST - ADD NEW PERSON
  app.post('/api/persons/', (req, res,next) => {
   /* const id = Math.floor(Math.random()*1000,0)*/
    const body = req.body
    
    if(body.name === "" || body.number === "" ){
        return res.status(400).json({ 
            error: 'Name and Number cannot be empty' 
        })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
      })
    
    person.save().then(result => {
        res.json(result)
      }).catch(error =>next(error))

    /*if (persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({ 
            error: 'Name must be Unique' 
        })
        }
        person = {...body,id:id}
        persons = persons.concat(person)
        res.json(person)*/
        
    })

  //DELETE PERSON 
  app.delete('/api/persons/:id',(req,res)=> {
      /*const id = Number(req.params.id)
      const resPersons = persons.filter(person => person.id !== id)
      console.log(resPersons)
      res.status(204).end*/
      Person.findByIdAndRemove(req.params.id).then(result =>{
        res.status(204).end()
      }).catch(error => next(error))
  })

  const errorHandler =(error,req,res,next)=> {
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } 

    if (error.name === 'ValidationError'){
      return res.status(400).json({error:error.message})
    }
  
    next(error)
  }

  app.use(errorHandler)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`PhoneBook Server running on port ${PORT}`)
  })