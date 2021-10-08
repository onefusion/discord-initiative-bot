const Discord = require('discord.js');
const config = require('./config.json');
let mongoose = require('mongoose');
const db = require('./database.js');
const Record = require('./models/Record');

const client = new Discord.Client();

let debug = true; //Set if debug mode is active or inactive

// Add a character to the initiative list
async function addChar(currchan, name, roll) {
    
    // if current channel not found in db collection, then create record for channel in db collection
    /*    ------------------------------------------------------------------------------------------------------------------
            findChannel

            Would it make sense to move this bit to a bot or channel initialization? 
            We'd want to be sure the channel record exists no matter which command is first. 
          ------------------------------------------------------------------------------------------------------------------*/
    debugmsg(findChannel(currchan))
    if (findChannel(currchan) == '1') {
        let newRecord = new Record({
            channel: currchan,
            initiative: [{name: name, roll: roll}]
        })

        await newRecord.save(function (err, doc){
            if (err) console.error(err)
                debugmsg(doc)
        })       
    /*    ------------------------------------------------------------------------------------------------------------------
            If we move the above bit to a separate function for initiativeialization, we don't need this wrapped in an else
          ------------------------------------------------------------------------------------------------------------------*/
          
    } else { // current channel is found in db collection -- pull record and set initiative to initiative_table
        let record = await Record.findOne({channel: currchan})
        debugmsg('addChar if record is in db statement')
        debugmsg(record)
        /*      ------------------------------------------------------------------------------------------------------------------
            Also, the next step before just pushing the character should be to check the existing table to see if it has 
                the character already. If it already has the character, do we give a message to say that character is already 
                in the list, and the update command should be used? 
            ------------------------------------------------------------------------------------------------------------------*/
        if (record.initiative.name == name) {
            // update character's roll
            record.initiative.roll = roll
            debugmsg('addChar if record is found in db, and record.initiative.name is same as name')
            debugmsg(record.initiative.roll)
            debugmsg(roll)
        }
        else {  // sets char object to name and roll
            let char = {
                'name': name,
                'roll': roll
            }

            // push char to record
            record.initiative.push(char)
            debugmsg(record.initiative)
            debugmsg(char)
            debugmsg(record)
        }

        // and then save the updated record
        await record.save(function (err, doc){
            if (err) console.error(err)
            debugmsg(doc)
        })    
    }    
}

// Search record for currchan
async function findChannel(currchan) {
    
    let record = await Record.findOne({channel: currchan})
    debugmsg(record)
    
    if (record === null) {
        debugmsg('channel not found (if record is null)')
        return '1'
    }
    else {
        if (record.channel == currchan) {
            debugmsg('channel found and is currchan')
            return record
        }
        else {
            debugmsg(record.channel)
            debugmsg('channel found but not currchan?')
            return record
        }
    }
}

//This function checks if debug mode is enabled (true)
function debugmsg(msg) {
    if (debug) {
        console.log(msg)
    }
}

//This function can toggle the debug mode variable. Ternary operator to simplify the statement. 
function toggleDebug() {
    debug = debug ? false : true;
}

addChar(1001, 'xzee', '3.2.1');
addChar(1001, 'skye', '3.0');
addChar(1001, 'zakar', '3.1.1');
addChar(1002, 'xzee', '1.2.3');
addChar(1001, 'jannik', '4.0.1');
addChar(1002, 'skye', '1.1.2');

