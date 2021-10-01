# Initiative Bot for Discord for FFG SWRPG Tabletop
- This is a fork of AntFay's original work, Initiative Bot for Discord.
- This fork specifically updates the bot to include syntax for Fantasy Flight Games' Star Wars Tabletop RPG line

## Commands
- Initiative always entered in syntax: success.advantageTtriumph, if no triumph on roll then success.advantage is sufficient
- **$add [name] [initiative roll]** - add a char to the initiative order
- **$order** - show initiative order
- **$remove [rank]** - removes a char from the specified rank in initiative
- **$switch [rank 1] [rank 2]** - swaps chars at specified ranks
- **$name [rank] [new name]** - renames a char at the specified rank in initiative
- **$reset** - clears the initiative table
- **$help** - embeds list of bot commands (set it the code, not here)

## Setup

### Windows
1. Install [node.js] (https://nodejs.org/en/)
2. Clone the project in desired folder: `git clone https://github.com/AntFay/discord-initiative-bot.git`
3. Alternatively, use the green download button at the top of the page to download a zip folder containing the project files.
4. Set up a new bot account through your discord [application page] (https://discordapp.com/developers/applications/)
5. Change `config.json.example` in the project directory to `config.json`, and add your discord application's auth token from your bot's application page.
6. Run `npm install` in the main project directory.
7. Run `node bot.js` to start the bot.

## To Do
~~Update $add command to throw error if name matches existing character name in order~~<br />
~~Add credit to original author, AntFay, where appropriate~~
- Add update command to update initiative of existing char
- Add help command to display commands and initiative syntax
- Update Windows install steps, as there is more involved related to setting up the bot Discord-side
- Add logic to handle multiple servers and channels maintaining separate lists
