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
    
    // sets char object to name and roll
    let char = {
        'name': name,
        'roll': roll
    }
    
    // if current channel not found in db collection, then create record for channel in db collection
    if (!findChannel(currchan)) {
        db.collection('records').insertOne({
            channel: currchan,
            init_table: char
        })        
    } else { // if current channel found in db collection, then pull the record, set local init to record's init_table, push char object to init_table, and then update the record in the db collection
        let record = db.collection('records').findOne({channel: currchan})
        let init = record.init_table
        init.push(char)
        db.collection('records').updateOne({channel: currchan},
            { 
                $set: {init_table: init}})
    } 
}

// Search record for currchan
function findChannel(currchan){
    if (!db.collection('records').find({channel: currchan})) {
        return false;
    }
    else { return true;
    }
}

addChar(1234, 'xzee', '3.2.1');
addChar(1234, 'skye', '3.0');
addChar(1234, 'zakar', '3.1.1');

