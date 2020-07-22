const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number= process.argv[4]

const url = 
`mongodb+srv://fullstack:${password}@cluster0.ubxri.mongodb.net/phonebook_app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number){
  const person = new Person({
  name: name,
  number: number,
  })

  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

} 
else{
  if(name && !number){
    console.log('Please provide number ')
    mongoose.connection.close()
  }
  else{
      
      Person.find({}).then(result => {
      console.log('Phonebook:')
      result.forEach(person => {
          console.log(person)
      })
    mongoose.connection.close()
    })
  }

}


