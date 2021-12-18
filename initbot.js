// const Discord = require('discord.js');
const config = require('./config.json');
let mongoose = require('mongoose');
const db = require('./database.js');
const Record = require('./models/Record');
const { findOne } = require('./models/Record');

// const client = new Discord.Client();

let debug = true; //Set if debug mode is active or inactive
global.record = {};

/* @TODO Add function for updating initiative table instead of doing it all in addToInitiative function
*/

// Add a character to the initiative list
async function addToInitiative(currchan, name, roll) {
    
    // run findChannel function passing currchan variable
    let foundChan = await findChannel(currchan, 'addToInitiative')
    debugmsg('addToInitiative: foundChan is ' + foundChan)

    let record = {}
    
    // if current channel not found in db collection, then create record for channel in db collection
    if (!foundChan) {
        
        // create new record for channel in db
        debugmsg('addToInitiative: call addNewRecord')
        record = await addNewRecord(currchan, name, roll)

    } 
    
    // current channel is found in db collection -- pull record and set rolls to record's initiative
    else { 
            
        // check for record matching currchan and name
        record = await findChar(currchan, name)
            
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
    
    // save the record
    debugmsg('addToInitiative: save record')
    let save = await saveRecord(record)

    return debugmsg('addToInitiative: complete')
    
}   
    
// Search record for currchan
async function findChannel(currchan, func) {
    
    let callerFunc = func
    
    // is the function that called findChannel addToInitiative?
    if (callerFunc = "addToInitiative") {
    
        // set record to result of findOne matching channel to currchan
        debugmsg('findChannel: searching for channel ' + currchan)
        let record = await Record.find({channel: currchan}).exec()
            
        // in mongoose or mongodb, if the findOne does not find a match it will return null, so is record null?
        if (record === null) {

            // pass null to next function so it can know record does not exist for currchan value
            debugmsg('findChannel: channel not found (record is null)')
            return null
            
        }
        
        // if record found, then record is not null and return record
        else {
            
            // record(s) found matching currchan, so debugmsg and return record(s)
            debugmsg('findChannel: record(s) found with channel ' + currchan)
            return record
        }
    }

    // is the function that called findChannel sortInitiative?
    else if (callerFunc = "sortInitiative") {

        //set record to result of findOne matching channel to currchan, but only with names and rolls
        debugmsg('findChannel: searching for channel ' + currchan)
        let record = await Record.find({channel: currchan}, {"name" : 1, "roll" : 1, "_id": 0}).exec()

        if (record === null) {

            //pass null to next function so it can know record does not exist for currchan value
            debugmsg('findChannel: channel not found (record is null)')
            return null

        }

        // return record and debugmsg
        else {

            debugmsg('findChannel: record(s) found with channel ' + currchan)
            return record
            
        }
    }
}

// This function searches for channel and character name
async function findChar(currchan, name) {

    let record = await Record.findOne({channel: currchan, name: name})
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

// This function sorts the returned records (name and roll) into an initiative order
async function sortInitiative(currchan) {

    let sortedInitiative = {}
    sortedInitiative = await findChannel(currchan, 'sortInitiative')
    debugmsg('sortInitiative: records to sort: ' + sortedInitiative)

    // if records not found matching channel, debugmsg out
    if (record === null) {

        debugmsg('sortInitiative: No records found matching channel')
    }

    // if only one record found, then no need to sort
    else if (sortedInitiative.length() == 1){

        debugmsg('sortInitiative: Only one character record found')
        debugmsg('sortInitiative: ' + sortedInitiative)
    }

    // multiple character records, so perform sort
    else { 

        // every record returned will have a number of rolls, but we need to split each roll to sort them properly
        for (roll in sortedInitiative) {

            // split the roll by the '.' character
            let splitRoll = sortedInitiative.roll.split(".")
            
            // set suc to a of 'a.b.c', and make it an integer
            suc = parseInt(splitRoll[0])
                
                // is there b of 'a.b.c'? if not, set adv to 0
                if (splitRoll[1] === undefined) {
                    adv = 0
                } 
                
                // otherwise, set adv to b of 'a.b.c'
                else {
                    adv = parseInt(splitRoll[1])
                }

                // is there c of 'a.b.c'? if not, set tri to 0
                if (splitRoll[2] === undefined) {
                    tri = 0
                }

                // otherwise, set tri to c of 'a.b.c'
                else {
                    tri = parseInt(splitRoll[2])
                }
            
            // perform sort
            record.sort((a,b) => {

                // figure out difference between b and a for success, advantage, and triumph
                var diffSuc = b.suc - a.suc
                var diffAdv = b.adv - a.adv
                var diffTri = b.tri - a.tri

                // if the difference in success, advantage, and triumph of the two rolls is 0, then randomize which character is first
                if (diffSuc == 0 && diffAdv == 0 && diffTri == 0) {
                    return Math.random() < 0.5 ? -1 : 1;
                }

                else if (diffAdv == 0) {
                    return diffTri;
                } 
                
                else if (diffSuc == 0) { 
                    return diffAdv;
                } 
                
                else if (diffTri == 0) {
                    return diffSuc;
                }
            })
        }

        debugmsg("sortInitiative: finished sort: " + sortedInitiative)
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

addToInitiative(10, 'Xzee', '1.0.1');
addToInitiative(10, 'Skye', '1.1');
addToInitiative(10, 'Zakar', '1.0');
addToInitiative(11, 'Xzee', '3.1');
addToInitiative(11, 'Jannik', '3.1.1');
addToInitiative(11, 'Skye', '3.0');

sortInitiative(10)
sortInitiative(11)
