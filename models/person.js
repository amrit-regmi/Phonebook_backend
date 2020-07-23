const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
mongoose.set('useFindAndModify', false)

console.log('initiating connection to ', url)
mongoose.connect(url, { useCreateIndex:true,useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    console.log('Connected')
  ).catch((error) => {
    console.log('Failed to connect to MongoDb', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minlength:3,
    required:true,
    unique:true
  },
  number: {
    type:String,
    minlength:8,
    required:true
  }
})

personSchema.plugin(uniqueValidator)
personSchema.set('toJSON',{
  transform: (document,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)