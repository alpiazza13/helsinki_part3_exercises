const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  "mongodb+srv://alpiazza13:password1234@cluster0-l8kuq.mongodb.net/phonebook-app?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = () => {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person ({
      name: name,
      number: number,
    })

    person.save().then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })
}

const showPeople = () => {
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
  addPerson()
}

else if (process.argv.length === 3) {
    showPeople()
}

else {
    console.log("Your command must have either 3 or 5 arguments - see instructions.")
    process.exit(1)
}
