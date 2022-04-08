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
    id: {type: Number, default: 0},
    username: {type: String, default: ''},
    key: {type: String, default: ''},
    has_trial: {type: Boolean, default: true},
    start_preiod_date: {type: Date, default: new Date()},
    end_preiod_date: {type: Date, default: new Date()},
    scripts: {type: Array, default: []}
})) 

server.use(function(request, response, next) {
    response.setHeader('Content-Type', 'application/json')
    next()
})

server.get('/get_users', async (request, response) => {
    // [User, User,...]
    response.json(await User.find())
})

server.get('/get_user', async (request, response) => {
    // User
    response.json(await User.findOne({key: request.query.key}))
})

server.get('/add_user', (request, response) => {
    // User
    const user = new User(request.query)
    user.save().then(async (error) => {
        response.json(user)
    })
})

server.get('/edit_user', async (request, response) => {
    // {
    //     "acknowledged": true,
    //     "modifiedCount": 1,
    //     "upsertedId": null,
    //     "upsertedCount": 0,
    //     "matchedCount": 1
    // }
    response.json(await User.updateOne(
        {key: request.query.key},
        request.query
    ))
})

server.get('/remove_user', async (request, response) => {
    // {
    //     "acknowledged": true,
    //     "deletedCount": 1 or 0
    // }
    response.json(await User.deleteOne(request.query))
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