const express = require('express')
const mongoose = require("mongoose")
const crypto = require("crypto")

const db = mongoose.connection
const server = express()

const generateUserKey = (username) => {
    return crypto.createHash('sha256')
        .update(username + new Date())
        .digest('base64').replaceAll('=', '')
        .replaceAll('&', '').replaceAll('?', '')
        .replaceAll('/', '').replaceAll('+', '')
}

require("dotenv").config()

mongoose.connect(
    process.env.databaseUri,
    { useNewUrlParser: true }
)

const User = mongoose.model('User', new mongoose.Schema({
    id: {type: Number, default: 0},
    username: {type: String, default: ''},
    key: {type: String, default: generateUserKey()},
    has_trial: {type: Boolean, default: true},
    start_preiod_date: {type: Date, default: new Date()},
    end_preiod_date: {type: Date, default: new Date()},
    scripts: {type: Array, default: []}
})) 

const Post = mongoose.model('Post', new mongoose.Schema({
    title: {type: String, default: ''},
    description: {type: String, default: ''},
    image: {type: String, default: ''}
})) 

server.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Content-Type', 'application/json')
    next()
})


server.get('/', (request, response) => {
    response.json({})
})

server.get('/get_posts', async (request, response) => {
    response.json({
        isLoginSuccess: request.query.adminApiKey === process.env.adminApiKey,
        posts: await Post.find()
    })
})

server.get('/add_post', (request, response) => {
    if (request.query.adminApiKey === process.env.adminApiKey) {
        delete request.query.adminApiKey
        try {
            const newPost = new Post(request.query)
            newPost.save().then(async (post, error) => {
                if (error) response.json({})
                else response.json(post)
            })
        } catch (error) {
            response.json({})
        } 
    } else {
        response.json({})
    }
})

server.get('/remove_post', async (request, response) => {
    if (request.query.adminApiKey === process.env.adminApiKey) {
        response.json(await Post.deleteOne({
            _id: request.query._id
        }))
    } else {
        response.json({deletedCount: 0})
    }
})


server.get('/get_users', async (request, response) => {
    if (request.query.adminApiKey === process.env.adminApiKey) {
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
    if (request.query.adminApiKey === process.env.adminApiKey) {
        response.json(await User.findOne({key: request.query.key}))
    } else {
        response.json({})
    }
})

server.get('/add_user', (request, response) => {
    if (request.query.adminApiKey === process.env.adminApiKey) {
        delete request.query.adminApiKey
        request.query.key = generateUserKey(response.username ? response.username : '')
        try {
            const newUser = new User(request.query)
            newUser.save().then(async (user, error) => {
                if (error) response.json({})
                else response.json(user)
            })
        } catch (error) {
            response.json({})
        } 
    } else {
        response.json({})
    }
})

server.get('/edit_user', async (request, response) => {
    if (request.query.adminApiKey === process.env.adminApiKey) {
        const key = request.query.key
        delete request.query.key
        delete request.query.adminApiKey

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
        response.json(await User.deleteOne({
            key: request.query.key
        }))
    } else {
        response.json({deletedCount: 0})
    }
})

server.listen(process.env.PORT || 5000, () => {
    console.log(`Start server app`)
})

db.on('error', () => {
    console.error('MongoDB connection error')
})

db.once('open', () => {
    console.log('MongoDB connection open')
})
