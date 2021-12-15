const Discord = require('discord.js');
const config = require('./config.json');
let mongoose = require('mongoose');
const db = require('./database.js');
const Record = require('./models/Record');

//const client = new Discord.Client();

let debug = true; //Set if debug mode is active or inactive

// Add a character to the initiative list
async function addChar(currchan, name, roll) {
    
    // if current channel not found in db collection, then create record for channel in db collection
    
    let foundChan = await findChannel(currchan)
          debugmsg('addChar: foundChan is ' + foundChan)
    if (!foundChan) {
        let newRecord = await new Record({
            channel: currchan,
            initiative: {name: name, roll: roll},
        })
        debugmsg('addChar: findChannel preparing new record')

        await newRecord.save(function (err, doc){
            if (err) console.error('newRecord.save err: ' + err)
                debugmsg('addChar err: ' + doc)
        }) 
        debugmsg('newRecord save completed: ' + newRecord)             
    } else { // current channel is found in db collection -- pull record and set initiative to initiative_table
        let record = await Record.findOne({channel: currchan}).exec()
        debugmsg('addChar: addChar if record is in db statement')
        //debugmsg('addChar: ' + await Record.findOne({channel: currchan}))
        debugmsg('addChar: init to add: name ' + name + ', roll ' + roll)
        
        // convert record's initiative object to key's array
        const keys = Object.keys(record.initiative)
        debugmsg('Keys array: '+keys)

        keys.forEach((key,index) => {
            debugmsg(`${key}: ${record.initiative[key]}`)

            if (record.initiative[key] == name) {
                    // update character's roll
                    record.initiative[key] = roll
                    debugmsg('addChar; record initiative: : addChar if record is found in db, and record.initiative.name is same as name')
                    debugmsg('addChar; record initiative added: name: ' + name + ', roll: ' + roll)
                    debugmsg('addChar; record initiative updated: ' + record.initiative)
                }
            else {  // sets char object to name and roll
                let char = {
                    'name': name,
                    'roll': roll,
                }

                // push char to record
                record.initiative.push(char)
                debugmsg('addChar; record initiative: ' + record.initiative)
                debugmsg('addChar; record initiative: adding char ' + char)
                //debugmsg('addChar; record initiative: ' + Record.findOne({channel: currchan}).exec())
            } 

            // and then save the updated record
            record.save(function (err, doc){
                if (err) console.error('record.save: ' ,err)
                debugmsg('addChar; record save doc: ' ,doc)
            })
    })   
    }    
}

// Search record for currchan
async function findChannel(currchan) {
    
    let record = await Record.findOne({channel: currchan}).exec()
    debugmsg('findChannel; record.findOne: ' + record)
    
    if (record === null) {

        debugmsg('findChannel: channel not found (record is null)')
        return null;
        
    }
    else {
        if (record.channel == currchan) {
            debugmsg('findChannel: channel found and is currchan')
            debugmsg('findChannel: channel '+record.channel)
            return record
        }
        else {
            debugmsg('findChannel: ' + record.channel)
            debugmsg('findChannel: channel found but not currchan?')
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

addChar(10, 'Xzee', '3.2.1');
addChar(10, 'Skye', '3.0');
//addChar(10, 'Zakar', '3.1.1');
//addChar(11, 'Xzee', '1.2.3');
//addChar(11, 'Jannik', '4.0.1');
//addChar(11, 'Skye', '1.1.2');
