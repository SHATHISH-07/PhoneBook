const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 10,
    required: true,

    set: function (value) {
      return value.replace(/\s+/g, '') // Remove spaces
    },

    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v) || /^\d{2,3}-\d{7,}$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number. Must be 10 digits (1234567890) or formatted (12-1234567).`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
