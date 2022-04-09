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

server.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Content-Type', 'application/json')
    next()
})

server.get('/get_users', async (request, response) => {
    if (request.query.adminApiKey === process.env.adminApiKey) {
        console.log("Get users list")
        response.json({
            isLoginSuccess: true,
            users: await User.find()
        })
    } else {
        response.json({
            isLoginSuccess: false,
            users: []
        })
    }
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
    if (request.query.adminApiKey === process.env.adminApiKey) {
        const key = request.query.key
        delete request.query.key
        delete request.query.adminApiKey

        console.log("Update user")
        response.json(await User.updateOne(
            {key: key},
            request.query
        ))
    } else {
        response.json({modifiedCount: 0})
    }
})

server.get('/remove_user', async (request, response) => {
    if (request.query.adminApiKey === process.env.adminApiKey) {
        console.log("Remove user")
        response.json(await User.deleteOne({
            key: request.query.key
        }))
    } else {
        response.json({deletedCount: 0})
    }
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