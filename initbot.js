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
    
    /**await db.collection('records').findOneAndUpdate({channel: currchan},
        {
            $get: {init_table}
           },
        
        {           
            $set: {channel: currchan, init_table: roll}}
        )
    **/
    // if current channel not found in db collection, then create record for channel in db collection
    
    /*      ------------------------------------------------------------------------------------------------------------------
            findChannel

            Would it make sense to move this bit to a bot or channel initialization? 
            We'd want to be sure the channel record exists no matter which command is first. 


            Also, is findChannel a discord function or one you wrote? I don't see it in the code here. 
          ------------------------------------------------------------------------------------------------------------------*/
    if (!findChannel(currchan)) {
        await db.collection('records').insertOne({
            channel: currchan,
            init_table: char
        }).exec();        
    /*      ------------------------------------------------------------------------------------------------------------------
            If we move the above bit to a separate function for initialization, we don't need this wrapped in an else
          ------------------------------------------------------------------------------------------------------------------*/
          
    } else { // current channel is found in db collection -- pull record
        let init = await db.collection('records').findOne({channel: currchan}, "init_table").exec();
        console.log(record)
/*      ------------------------------------------------------------------------------------------------------------------
            Also, the next step before just pushing the character should be to check the existing table to see if it has 
                the character already. If it already has the character, do we give a message to say that character is already 
                in the list, and the update command should be used? 
          ------------------------------------------------------------------------------------------------------------------*/

        // set local init to record's init_table and push char object to local init
          record.init_table.push(char)
        
        // and then update the record's init_table in the db collection
        await db.collection('records').findOneAndUpdate({channel: currchan},
            { 
                $set: {init_table: init}
            }
        ).exec();
    } 
}

// Search record for currchan
async function findChannel(currchan) {

    if (await db.collection('records').findOne({channel: currchan}).exec() === null) {
        return false;
    }
    else {
        return true;
    }
}

addChar(1001, 'xzee', '3.2.1');
addChar(1001, 'skye', '3.0');
addChar(1001, 'zakar', '3.1.1');
addChar(1002, 'xzee', '1.2.3');
addChar(1001, 'jannik', '4.0.1');
addChar(1002, 'skye', '1.1.2');

