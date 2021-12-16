// const Discord = require('discord.js');
const config = require('./config.json');
let mongoose = require('mongoose');
const db = require('./database.js');
const Record = require('./models/Record');
const { findOne } = require('./models/Record');

//const client = new Discord.Client();

let debug = true; //Set if debug mode is active or inactive
global.record = {};

/* @TODO Add function for updating initiative table instead of doing it all in addToInitiative function
*/

// Add a character to the initiative list
async function addToInitiative(currchan, name, roll) {
    
    // run findChannel function passing currchan variable
    let foundChan = await findChannel(currchan)
    debugmsg('addToInitiative: foundChan is ' + foundChan)
    
    // if current channel not found in db collection, then create record for channel in db collection
    if (!foundChan) {
        
        // create new record for channel in db
        debugmsg('addToInitiative: call addNewRecord')
        record = await addNewRecord(currchan, name, roll)

    } 
    
    // current channel is found in db collection -- pull record and set rolls to record's initiative
    else { 
            
        // check for record matching currchan and name
        record = await findChar(currchan, name, roll)
            
        // if record was not found matching currchan and name, then create a new record
        if (!record) {
                
            // create new record
            record = await addNewRecord(currchan, name, roll)
            debugmsg('addToInitiative, create new record: ' + record)

        }

        // record found matching currchan and name, so set roll in record to roll
        else { 
                
            // set roll in record to roll
            record = await setRoll(record, roll)
            debugmsg('addToInitiative: setRoll: ' + record)

        }
    }
    
    // and then save the record
    debugmsg('addToInitiative: save record')
    let save = await saveRecord(record)
    
}   
    

// Search record for currchan
async function findChannel(currchan) {
    
    // set record to result of findOne matching channel to currchan
    let record = await Record.findOne({channel: currchan}).exec()
    debugmsg('findChannel: searching for channel ' + currchan)
    debugmsg('findChannel: record.findOne: ' + record)
    
    // in mongoose or mongodb, if the findOne does not find a match it will return null, so is record null?
    if (record === null) {

        debugmsg('findChannel: channel not found (record is null)')
        
        // pass null to next function so it can know record does not exist for currchan value
        return null;
        
    }
    
    // if record found, then record is not null
    else {
        
        // record is not null, but is the found record's channel equal to currchan?
        // return the record found either way
        // note: this if/else is not necessary, but we wanted to include for logging purposes in case it bugs unexpectedly
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

// This function searches for channel and character name
async function findChar(currchan, name) {

    let record = await findOne({channel: currchan}, {name: name})
    debugmsg('findChar: ' + record)
    return record

}

// This function creates a new Record
async function addNewRecord(currchan, name, roll){
    
    // create new record from recordSchema
    let record = await new Record({
        channel: currchan,
        name: name, 
        roll: roll,
    })
    
    debugmsg('addNewRecord: ' + record)
    return record

}

// This function saves a record in the database
async function saveRecord(record) {
    
    await record.save(function (err, doc){
        if (err) console.error('record.save: ' ,err)
        debugmsg('saveRecord: record save doc: ' ,doc)
    })

}

// This function sets the roll of a record in the database
async function setRoll(record, roll) {

    // set record.roll to roll
    debugmsg('setRoll: record.roll is ' + record.roll)
    record.roll = roll
    
    // return updated record
    debugmsg('setRoll: record updated to ' + record)
    return record

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

addToInitiative(10, 'Xzee', '2.1.0');
addToInitiative(10, 'Skye', '2.0');
addToInitiative(10, 'Zakar', '2.1.1');
addToInitiative(11, 'Xzee', '1.1');
addToInitiative(11, 'Jannik', '1.0.1');
addToInitiative(11, 'Skye', '1.1.1');
