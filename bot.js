const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');

var initiative_table = [];

function addUnit(name, roll) {
  for (var i = 0; i < initiative_table.length; i++) {
    if(name === initiative_table[i].name) throw 'Character already exists.';
  }
  
  if(name === undefined || roll === undefined) throw 'Both a character name and Initiative Roll are required.';
    arr = roll.split("T");
    sucadv = parseFloat(arr[0]);
    if(arr[1] === undefined) {
      tri=0;
    }
    else {
      tri = parseFloat(arr[1]);
    }
  if(Number.isNaN(Number.parseInt(sucadv, 10))) throw 'Initiative Roll must be in format success.advantageTtriumph.';

  var player = {
    'name': name,
    'roll': roll,
    'sucadv': sucadv,
    'tri': tri
  };
    
  
  initiative_table.push(player);

  //sort initiative_table
  initiative_table.sort((a, b) => {
    var diffSucAdv = b.sucadv - a.sucadv
    var diffTri = b.tri - a.tri
    
    if(diffSucAdv == 0 && diffTri == 0) {
      return Math.random() < 0.5 ? -1 : 1;
    }
    else if (diffSucAdv == 0) {
      return diffTri;
    }
    else {
      return diffSucAdv;
    }
  });
}

function removeUnit(rank) {
  if(rank === undefined || Number.isNaN(Number.parseInt(rank, 10))) throw 'Initiative slot as an integer is required.';
  if(rank <= 0 || rank > initiative_table.length) throw 'Invalid char specified. Initiative slot specified exceeds length of initiative order.';

  return initiative_table.splice(rank-1, 1);
}

function switchUnits(rank1, rank2) {
  if(rank1 === undefined || rank2 === undefined) throw 'Two initiative slots must be specified to switch.';
  if(Number.isNaN(Number.parseInt(rank1, 10)) || Number.isNaN(Number.parseInt(rank2, 10))) throw 'Initiative slots must be integers.';
  if(rank1 <= 0 || rank1 > initiative_table.length) throw 'Invalid first initiative slot specified. Initiative slot specified exceeds length of initiative order.';
  if(rank2 <= 0 || rank2 > initiative_table.length) throw 'Invalid second initiative slot specified. Initiative slot specified exceeds length of initiative order.';

  var temp = initiative_table[rank1 - 1];
  initiative_table[rank1 - 1] = initiative_table[rank2 - 1];
  initiative_table[rank2 - 1] = temp;
}

function nameUnit(rank, name) {
  if(rank === undefined || name === undefined) throw 'Both an Initiative Slot and Character Name must be specified.';
  if(Number.isNaN(Number.parseInt(rank, 10))) throw 'Intiative slot must be an integer.';
  if(rank <= 0 || rank > initiative_table.length) throw 'Invalid character specified. Initiative slot specified exceeds length of initiative order. Did you mean to use $add?';

  initiative_table[rank - 1].name = name;
}

function format_order() {
  if(initiative_table.length < 1) throw 'Initiative Order is Empty. Use $add to add a character to initiative.';

  var embed = new Discord.RichEmbed();

  //TODO: Differentiate between PC/NPC or Party/Enemies?

  order_text = '';
  for (var i = 0; i < initiative_table.length; i++) {
    var rank = i+1;
    order_text += rank + ': **' + initiative_table[i].name + '** (' + initiative_table[i].roll + ')\n';
  }

  embed.addField('Initiative Order', order_text);

  return embed;
}

function deleteMessage(message) {
  message.delete().catch((e) => {
    console.log(e);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendTempMessage(text, channel) {
  channel.send(text)
    .then((message) => {
      delayedDelete(message, config['message-delay']);
    });
}

async function delayedDelete(message, ms) {
  await sleep(ms);
  deleteMessage(message);
}

client.on("ready", () => {
  console.log("Initiative bot Online!");
});

client.on("message", (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(config.prefix)) {
    console.log("Message Received: " + message.content);
    var args = message.content.split(' ');
    var command = args.shift().substring(1).toLowerCase(); //First argument is always the command. Strip the '$'
    var channel = message.channel;

    switch(command) {
      case 'add':
        try {
          let name = args.slice(0, args.length - 1).join(' ');
          addUnit(name, args[args.length-1]);
          sendTempMessage("Added " + name + " to the initiative order.", channel);
        } catch (e) {
          console.log(e);
          message.author.send(e); //This needs to be changed eventually
        }
        deleteMessage(message);
        break;
      case 'remove':
        try {
          let unit = removeUnit(args[0]);
          sendTempMessage("Removed " + unit[0].name + " from the initiative order.", channel);
        } catch (e) {
          console.log(e);
          message.author.send(e);
        }
        deleteMessage(message);
        break;
      case 'switch':
        try {
          switchUnits(args[0], args[1]);
          sendTempMessage("Initiative order switched.", channel);
        } catch (e) {
          console.log(e);
          message.author.send(e);
        }
        deleteMessage(message);
        break;
      case 'name':
        try {
          nameUnit(args[0], args.slice(1).join(' '));
          sendTempMessage("Character renamed.", channel);
        } catch (e) {
          console.log(e);
          message.author.send(e);
        }
        deleteMessage(message);
        break;
      case 'order':
        try {
          message.channel.send(format_order());
        } catch(e) {
          console.log(e);
          message.author.send(e);
        }
        deleteMessage(message);
        break;
      case 'reset':
        initiative_table = [];
        deleteMessage(message);
        break;
      case 'help':
        try { 
          var embed = new Discord.RichEmbed();
          help_text = '$add [name] [initiative] - add a char to the initiative order.\nNote: initiative should be entered as success.advantageTtriumph (such as 3.2T1).\n$order - shows current iniative order.\n$remove [rank] - remove a char from the specified rank in initiative (initiative slot).\n$switch [rank1] [rank2] - swaps chars at specified ranks.\n$name [rank] [new name] - renames a char at the specified rank in initiative.\n$reset - clears the initiative table.\n$help - shows available commands for the bot.\n';
          embed.addField('Available Bot Commands', help_text);
          message.channel.send(embed);
        } catch (e) {
          console.log(e);
          message.author.send(e);
        }
        break;
      }
  }
});

client.login(config.token);
