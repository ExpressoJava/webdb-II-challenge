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

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
