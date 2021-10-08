const mongoose = require('mongoose')
const Schema = mongoose.Schema

let recordSchema = new Schema({
    channel: { type: String, required: true, index: true, unique: true },
    initiative: [{ name: String , roll: String }]
})

module.exports = mongoose.model('Record', recordSchema)