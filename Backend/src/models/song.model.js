const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    mood: String,
    audio: String,
})

const Song = mongoose.model('song', songSchema)

module.exports = Song