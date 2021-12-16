const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    channel: String,
    name: { type: String, lowercase: true },
    roll: String,
})

module.exports = mongoose.model('Record', recordSchema)