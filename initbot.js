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
        let newRecord = new Record({
            channel: currchan,
            initiative: {name: name, roll: roll}
        })
        debugmsg('addChar: findChannel made a new record')

        await newRecord.save(function (err, doc){
            if (err) console.error('newRecord.save err: ' + err)
                //debugmsg('addChar err: ' + doc)
        }) 
        debugmsg('newRecord save completed')      
    
          
    } else { // current channel is found in db collection -- pull record and set initiative to initiative_table
        await Record.findOne({channel: currchan})
        debugmsg('addChar: addChar if record is in db statement')
        //debugmsg('addChar: ' + await Record.findOne({channel: currchan}))
        debugmsg('addChar: record.init ' + await Record.findOne([{channel: currchan}],[{channel: currchan}.$initiative]))

        if (await Record.findOne([{channel: currchan}], currchan.initiative.name == name)) {
            // update character's roll
            await Record.findOneAndUpdate([{channel: currchan}, currchan.initiative.name == name],[{channel: currchan}, currchan.initiative.roll = roll])
            debugmsg('addChar; record initiative: : addChar if record is found in db, and record.initiative.name is same as name')
            debugmsg('addChar; record initiative: : ' + Record.find([{channel: currchan}], currchan.initiative))
            debugmsg('addChar; record initiative: : ' + roll)
        }
        else {  // sets char object to name and roll
            let char = {
                'name': name,
                'roll': roll
            }

            // push char to record
            Record.findOneAndUpdate({channel: currchan}, [{channel: currchan}, currchan.initiative.push(char)]).exec()
            debugmsg('addChar; record initiative: ' + Record.findOne([{channel: currchan}], currchan.initiative))
            debugmsg('addChar; record initiative: ' + char)
            //debugmsg('addChar; record initiative: ' + Record.findOne({channel: currchan}).exec())
        }

        // and then save the updated record
        await Record.save(function (err, doc){
            if (err) console.error('record.save:' ,err)
            //debugmsg('addChar; record save doc: ' ,doc)
        })    
    }    
}

// Search record for currchan
async function findChannel(currchan) {
    
    Record.findOne({channel: currchan}).exec()
    debugmsg('findChannel; record.findOne: ' + Record.findOne({channel: currchan}).exec())
    
    if (Record.findOne({channel:currchan}).exec() === null) {

        debugmsg('findChannel: channel not found (record is null)')
        return undefined;
        
    }
    else {
        if (Record.findOne({channel: currchan}).exec() == currchan) {
            debugmsg('findChannel: channel found and is currchan')
            return (Record.findOne({channel: currchan}).exec())
        }
        else {
            debugmsg('findChannel: ' + Record.findOne({channel: currchan}).exec())
            debugmsg('findChannel: channel found but not currchan?')
            return (Record.findOne({channel: currchan}).exec())
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

/*async function addNewChannel(currchan, name, roll) {
    let record = await Record.findOne({channel: currchan}).exec()
    debugmsg('Searching for channel...' + currchan);

    if (Record.findOne({channel: currchan}).exec() === null) {
        let newRecord = new Record({
            channel: currchan,
            initiative: [{name: name, roll: roll}]
        })
        debugmsg('addChar: findChannel made a new record for channel ' + currchan)

        await newRecord.save(function (err, doc){
            if (err) console.error('newRecord.save' + err)
                //debugmsg('addChar: ' + doc)
        })
    }
    else {
        debugmsg('Channel ' + record.channel + ' found.')
    }
}*/

addChar(10, 'xzee', '3.2.1');
addChar(11, 'skye', '3.0');
addChar(12, 'zakar', '3.1.1');
addChar(12, 'xzee', '1.2.3');
addChar(11, 'jannik', '4.0.1');
addChar(12, 'skye', '1.1.2');
