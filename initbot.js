const Discord = require('discord.js');
const config = require('./config.json');
let mongoose = require('mongoose');
const db = require('./database.js');

const client = new Discord.Client();

function dbCreateSchema() {// Creates the base Records Schema format
    let recordSchema = new mongoose.Schema({
        channel: {
            type: String,
            required: true
        },
        init_table: {
            type: Array
        }
    })

    recordTable=mongoose.model('records', recordSchema);
}



// Add a character to the initiative list
function addChar(currchan, name, roll) {
    console.log(currchan,name,roll);
    findChannel(currchan);
    
    let char = {
        'name': name,
        'roll': roll
    }
    
    db.collection('records').insertOne({
        channel: currchan,
        init_table: char
    });

    console.log(db.collection('records').findOne({channel: currchan}))
}

// Search record for currchan
function findChannel(currchan){
    db.collection('records').findOne({channel: currchan})
    console.log(db.collection('records').findOne({channel: currchan}), currchan);       
}


dbCreateSchema();
addChar(1, 'xzee', '3.2.1');

