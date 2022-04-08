const express = require('express')
const mongoose = require("mongoose")

const db = mongoose.connection
const server = express()
const port = 4000

require("dotenv").config()

mongoose.connect(
    process.env.databaseUri,
    { useNewUrlParser: true }
)

const User = mongoose.model('User', new mongoose.Schema({
    id: Number,
    username: String,
    key: String,
    hash: Boolean,
    start_preiod_date: Date,
    end_preiod_date: Date,
    scripts: Array
})) 

server.get('/get_users', (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    response.json({value: 'hello'})
})

server.get('/get_user', (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    response.json({value: 'hello'})
})

server.post('/add_user', (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.json({value: 'hello'})
})

server.post('/edit_user', (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    response.json({value: 'hello'})
})

server.post('/remove_user', (request, response) => {
    response.setHeader('Content-Type', 'application/json')

    response.json({value: 'hello'})
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
})

db.on('error', () => {
    console.error('MongoDB connection error')
})

db.once('open', () => {
    console.log('MongoDB connection open')
})