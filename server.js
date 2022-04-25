const express = require('express')
const mongoose = require("mongoose")
const crypto = require("crypto")

const db = mongoose.connection
const server = express()

const generateUserKey = (username) => {
    return crypto.createHash('sha384')
        .update(username + new Date(), 'utf-8')
        .digest('hex')
}

const UTCDate = (date = null) => {
    const currentDate = date ? new Date(date) : new Date() 
    return new Date(currentDate.toUTCString().substr(0, 25))
}

const nowDateAdd = (hours) => {
    return UTCDate(new Date().getTime() + hours * 3600000)
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
    is_key_active: {type: Boolean, default: false},
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
    console.log(`${request.method} ${response.statusCode} ${request.path}`)
    next()
})


server.get('/', async (request, response) => {
    // await User.deleteMany({})
    response.json({})
})

server.get('/get_users', async (request, response) => {
    try {
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
    } catch (error) {
        console.error(error)
        response.json({isLoginSuccess: false, users: []})
    }
})

server.get('/get_user', async (request, response) => {
    try {
        const user = await User.findOne({key: request.query.key})

        if (user && !user.is_key_active) {
            let howMuchLeft = UTCDate(user.end_preiod_date) - UTCDate(user.start_preiod_date)
            howMuchLeft /= (60 * 60 * 1000)

            user.start_preiod_date =  UTCDate()
            user.end_preiod_date = nowDateAdd(howMuchLeft)

            await User.updateOne({key: user.key}, {
                start_preiod_date: user.start_preiod_date,
                end_preiod_date: user.end_preiod_date,
                is_key_active: true
            })
        }
        response.json(user)

    } catch (error) {
        console.error(error)
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
    try {
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
    } catch (error) {
        console.error(error)
        response.json({modifiedCount: 0})
    }
})

server.get('/remove_user', async (request, response) => {
    try {
        if (request.query.adminApiKey === process.env.adminApiKey) {
            response.json(await User.deleteOne({
                key: request.query.key
            }))
        } else {
            response.json({deletedCount: 0})
        }
    } catch (error) {
        console.error(error)
        response.json({deletedCount: 0})
    }
})

// Post's actions

server.get('/get_posts', async (request, response) => {
    try {
        response.json({
            isLoginSuccess: request.query.adminApiKey === process.env.adminApiKey,
            posts: await Post.find()
        })
    } catch (error) {
        console.error(error)
        response.json({isLoginSuccess: false, posts: []})
    }
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
    try {
        if (request.query.adminApiKey === process.env.adminApiKey) {
            response.json(await Post.deleteOne({
                _id: request.query._id
            }))
        } else {
            response.json({deletedCount: 0})
        }
    } catch (error) {
        console.error(error)
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
