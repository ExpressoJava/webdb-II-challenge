const express = require('express')
const helmet = require('helmet')
const knex = require('knex')

const server = express()

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3' // either string/object
  },
  useNullAsDefault: true, // needed for sqlite
}

const db = knex(knexConfig)


server.use(express.json())
server.use(helmet())



// endpoints here
server.get('/', (req,res) => {
  res.json({API: 'Going live'})
})

// List all zoos animals from database if any

server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos') // list all record from parent's table if any
    res.status(200).json(zoos)
  } catch (error) {
    res.status(500).json(error)
  }
})

// Get single zoos animal by id
server.get('/api/zoos/:id', async (req, res) => {
  // .first() - returns first record from query
  //in where(), you can also do this with string: ('id', req.params.id) syntax
try {
    const zoo = await db('zoos').where({id: req.params.id}).first() 
    res.status(200).json(zoo)
  } catch (error) {
    res.status(500).json(error)
  }
})


const errors = {
  '19': 'Another record with that string name exists'
}
// Create zoos animal
server.post('/api/zoos', async (req, res) => {
  try {
    //To insert multiple records, pass an array instead of an object to .insert()
    const [id] = await db('zoos').insert(req.body)
    const zoo = await db('zoos').where({id}).first() // respond with the id of the last record inserted
    res.status(201).json(zoo)
  } catch (error) {
    const message = errors[errors.errno] || 'We ran into an error'
    res.status(500).json({message, error})
  }
})

// Update zoos animal
server.put('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos').where({id: req.params.id}).update(req.body)
    
    if (count > 0) {
     const zoo = await db('zoos').where({id: req.params.id}).first()
      res.status(200).json(zoo) // or .json(count), depending on you
    } else {
      res.status(404).json({message: 'Record not found' })
    }
  } catch(error) {
    res.status(500).json(error)
  }
  
})

// Remove zoos animal

server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos').where({id: req.params.id}).del()
    
    if (count > 0) {
    
      res.status(204).end()
    } else {
      res.status(404).json({message: 'Record not found' })
    }
  } catch(error) {
    res.status(500).json(error)
  }
  
})

const port = 3300
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`)
})
