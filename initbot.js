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
async function addChar(currchan, name, roll) {
    
    // sets char object to name and roll
    let char = {
        'name': name,
        'roll': roll
    }
    
    await db.collection('records').findOneAndUpdate({channel: currchan},
        {
            $get: {init_table}
           },
        
        {           
            $set: {channel: currchan, init_table: roll}}
        )
    // if current channel not found in db collection, then create record for channel in db collection
    if (!findChannel(currchan)) {
        await db.collection('records').insertOne({
            channel: currchan,
            init_table: char
        })        
    } else { // current channel is found in db collection -- pull record
        let record = await db.collection('records').findOne({channel: currchan})
        console.log(record)
        // set local init to record's init_table and push char object to local init
          record.init_table.push(char)
        
        // and then update the record's init_table in the db collection
        await db.collection('records').findOneAndUpdate({channel: currchan},
            { 
                $set: {init_table: init}
            }
        )
    } 
}

// Search record for currchan

addChar(1001, 'xzee', '3.2.1');
addChar(1001, 'skye', '3.0');
addChar(1001, 'zakar', '3.1.1');
addChar(1002, 'xzee', '1.2.3');
addChar(1001, 'jannik', '4.0.1');
addChar(1002, 'skye', '1.1.2');

