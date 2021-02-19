const Discord = require("discord.js");

const bot = new Discord.Client();
const help = require('./commands/help')

// DEMARRAGE DU BOT ***************************//
bot.on("ready", () => {
    console.log("Bot Maiden démarré");
    bot.user.setActivity('Préparation de la TW').catch(console.error)
})

bot.login(process.env.TOKEN);

// GOOGLE SHEET ***************************//
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');

function printPlayer (player, message) {

    console.log(`Hello : ${player.player}`);
    console.log(`${player._dw4je}`);
    message.reply(`Hello ${player.player} Voici ta défense TW : ${player._dw4je}`);
    // _dw4je vaut la valeur concatené des teams a poser
    console.log('----------------------');
}

    async function accessSpreadsheet(message) {
    console.log('Debut');
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[9];
    
    const rows = await promisify(sheet.getRows)({
        query: '_cn6ca = FALSE'
    });

    rows.forEach(row => {
        printPlayer(row, message);
    })

    async function registerMember(user) {
        const doc = new GoogleSpreadsheet(process.env.SHEETKEY);
        await promisify(doc.useServiceAccountAuth)(creds);
        const info = await promisify(doc.getInfo)();
        const sheet = info.worksheets[10];

        const rows = {
            id = user.id,
            username = user.username
        }

        await promisify(sheet.addRow)(row);
    }
}

// MESSAGE DU BOT ***************************//
bot.on('message', function(message){
    if(help.match(message)) {
        return help.action(message)
    }    
    if(message.content === 'md.tw_assignation'){
        accessSpreadsheet(message);
    }

    if(message.content === 'md.r'){
        registerMember(user);
    }
})
