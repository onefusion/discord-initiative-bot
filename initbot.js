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
    
    let foundChan = await findChannel(currchan)
          //debugmsg('addChar: foundChan is '+foundChan)
    if (foundChan === undefined) {
        let newRecord = new Record({
            channel: currchan,
            initiative: [{name: name, roll: roll}]
        })
        debugmsg('addChar: findChannel made a new record')

        await newRecord.save(function (err, doc){
            if (err) console.error('newRecord.save err: ' + err)
                //debugmsg('addChar err: ' + doc)
        }) 
        debugmsg('newRecord save completed')      
    
          
    } else { // current channel is found in db collection -- pull record and set initiative to initiative_table
        let record = await Record.findOne({channel: currchan})
        debugmsg('addChar: addChar if record is in db statement')
        //debugmsg('addChar: ' + record)
        //debugmsg('addChar: record.init '+record.initiative)

        
        if (record.initiative.name == name) {
            // update character's roll
            record.initiative.roll = roll
            debugmsg('addChar; record initiative: : addChar if record is found in db, and record.initiative.name is same as name')
            debugmsg('addChar; record initiative: : ' +record.initiative.roll)
            debugmsg('addChar; record initiative: : ' +roll)
        }
        else {  // sets char object to name and roll
            let char = {
                'name': name,
                'roll': roll
            }

            // push char to record
            record.initiative.push(char)
            //debugmsg('addChar; record initiative: ' +record.initiative)
            //debugmsg('addChar; record initiative: ' +char)
            //debugmsg('addChar; record initiative: ' +record)
        }

        // and then save the updated record
        await record.save(function (err, doc){
            if (err) console.error('record.save:' ,err)
            //debugmsg('addChar; record save doc: ' ,doc)
        })    
    }    
}

// Search record for currchan
async function findChannel(currchan) {
    
    let record = await Record.findOne({channel: currchan}).exec()
    //debugmsg('findChannel; record.findOne: ' + record)
    
    if (record === null) {

        debugmsg('findChannel: channel not found (if record is null)')
        return undefined;
        
    }
    else {
        if (record.channel == currchan) {
            debugmsg('findChannel: channel found and is currchan')
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


async function testData() {

await addChar(1001, 'xzee', '3.2.1');
debugmsg('Xzee added in 1001');
await addChar(1001, 'xzee', '6.5.1');
debugmsg('Xzee added in 1001');
await addChar(1001, 'skye', '3.0');
debugmsg('Skye added in 1001');
await addChar(1001, 'zakar', '3.1.1');
debugmsg('Zakar added in 1001');
await addChar(1002, 'xzee', '1.2.3');
debugmsg('Xzee added in 1002');
await addChar(1001, 'jannik', '4.0.1');
debugmsg('Jannik added in 1001');
await addChar(1002, 'skye', '1.1.2');
debugmsg('Skye added in 1002');
}

testData()