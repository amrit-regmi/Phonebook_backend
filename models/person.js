const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('initiating connection to ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result=>{
        console.log("Connected")
    }).catch((error)=>{
        console.log('Failed to connect to MongoDb', error.message)
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON',{
    transform: (document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)