const mongoose = require('mongoose')
const recordSchema = new mongoose.Schema({
    channel: {  type: String, 
                required: true, 
                index: true },
    initiative: {
        name: { type: String, lowercase: true }, 
        roll: String},
})

module.exports = mongoose.model('Record', recordSchema)