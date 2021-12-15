const mongoose = require('mongoose')
const Schema = mongoose.Schema

let recordSchema = new Schema({
    channel: { type: String, required: true, index: true },
    initiative: { }
})

module.exports = mongoose.model('Record', recordSchema)