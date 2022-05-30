require('dotenv/config') // needed to use .env file to store our MONGO_URL link
const express = require('express')
const mongoClient = require('mongodb').MongoClient
const mongo = require('mongodb')

const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const url = process.env.MONGO_URL // coming from MONGO_URL from .env file

// these are so that that mongo does not give warnings
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

let menudb, customersdb // creating global variables so we could reuse as needed

mongoClient.connect(url, options, (err, mongoClient) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('we are connected!')

  app.listen(3000, () => console.log('app is listening on port 3000'))

  const db = mongoClient.db('restaurant')
  customersdb = db.collection('customers') // assigning a the 'customer' collection to the customerdb
  menudb = db.collection('menu') // assigning a 'menu' collection to the menudb
})

// send 'Hey class'
app.get('/', (req, res) => res.status(200).send('Here is my api on AWS!!'))

// get all items in menu
app.get('/menu', (req, res) => {
  menudb.find().toArray((err, allMenuItems) => {
    if (err) {
      res.send(err)
      return
    }
    res.status(200).send(allMenuItems)
  })
})

// add new menu item from req.body
app.post('/', (req, res) => {
  menudb
    .insertOne(req.body)
    .then(() => res.status(200).send('Item was added'))
    .catch(err => res.status(500).send(err))
})

// update menu item by ID passed by param
app.patch('/:id', (req, res) => {
  const { id } = req.params
  menudb
    .updateOne({ _id: mongo.ObjectId(id) }, { $set: { name: 'tequila', cost: 60, stock: true, brand: 'Patron' } })
    .then(() => res.status(200).send('item was updated'))
    .catch(err => res.status(500).send(err))
})

// delete menu item by name
delete app.delete('/', (req, res) => {
  menudb
    .deleteOne({ name: req.body.name })
    .then(() => res.send('item was deleted'))
    .catch(err => res.status(500).send(err))
})
