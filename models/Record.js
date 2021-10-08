const mongoose = require('mongoose')
const Schema = mongoose.Schema

let recordSchema = new Schema({
    channel: { type: String, unique: true, required: true },
    initiative: [{ name: String, unique: true, roll: String }]
})

module.exports = mongoose.model('Record', recordSchema)