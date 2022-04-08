const mongoose = require("mongoose")
const db = mongoose.connection

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

const addUser = async (user) => {
    return new User(user)
}

const findUser = async (key) => {
    return await User.find({key: key})
}

awesome_instance.save().then(async () => {
    console.log(User.find({key: "efgrgesgesg"}))
})

db.on('error', () => {
    console.error('MongoDB connection error')
})

db.once('open', () => {
    console.log('MongoDB connection open')
})