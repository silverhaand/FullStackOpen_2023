/* eslint-disable no-unused-vars */

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const numValidator = (phoneNum) => {
  const splitOnDash = phoneNum.split('-')
  if (splitOnDash.length === 1 && !isNaN(phoneNum)) return true

  const [beforeDash, afterDash] = splitOnDash

  return (
    splitOnDash.length === 2 &&
        (beforeDash.length === 2 || beforeDash.length === 3) &&
        !isNaN(beforeDash) &&
        !isNaN(afterDash)
  )
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: numValidator,
    required: true
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
