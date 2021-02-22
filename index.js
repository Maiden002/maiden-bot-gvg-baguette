const Discord = require("discord.js");

const bot = new Discord.Client();
const help = require('./commands/help')
const {prefix} = require("./config.json");

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

let testRegister = true;

function printPlayer (player, message) {

    console.log(`Hello : ${player.player}`);
    console.log(`${player._dw4je}`);
    message.reply(`Hello ${player.player} Voici ta défense TW : ${player._dw4je}`);
    // _dw4je vaut la valeur concatené des teams a poser
    console.log('----------------------');
}

async function accessSpreadsheet(message, members) {
    console.log('Debut');
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[9];
    const sheetMemberslst = info.worksheets[10];
    
    const rows = await promisify(sheet.getRows)({
        query: '_cn6ca = FALSE'
    });

    const rowMembers = await promisify(sheetMemberslst.getRows)({
        offset: 1
    });

    let recap = "```Les membres suivants ont reçu leurs poses en défense : ";

    rows.forEach(row => {
        let player = row._djhdx;
        let poseEnDef = row._dw4je;
        rowMembers.forEach(row2 => {
            if(row2.username === player) {
                let identifiant = row2.identifiant;
                    if (message.channel.type !== "text") return;
                    members.forEach(member => {
                        // Si le membre est un bot, l’ignorer
                        if (member.user.bot) return;
                        // Envoyer le message au membre
                        if(member.user.id == identifiant)
                            member.send(poseEnDef);  
                            recap =  recap + member.user.username + ", ";
                        });
            }
        })
    })
    recap = recap + '```';
    message.channel.send(recap);
    console.log("Fin");
}

async function registerMember(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[10];
    testRegister = true;
    let idToInsert = "";
    let userNameToInsert = "";
    let rowToAdd = "";

    if(user){
        rowToAdd = {
            identifiant: user.id,
            username: user.user.username
        }
        idToInsert = user.id;
        userNameToInsert = user.user.username;
    } else {
        rowToAdd = {
            identifiant: message.author.id,
            username: message.author.username
        }
        idToInsert = message.author.id;
        userNameToInsert = message.author.username;
    } 

    const rows = await promisify(sheet.getRows)({
        offset: 1
    });

    rows.forEach(row => {
        if(row.identifiant === idToInsert) {
            testRegister = false;
        }
    })

    if(testRegister) {
        await promisify(sheet.addRow)(rowToAdd);
        message.channel.send('> ' + userNameToInsert + ' est maintenant enregistré.');
    } else {
        message.channel.send('> ' + userNameToInsert + ' est déjà enregistré.');
    }
}

async function unregisterMember(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[10];
    let idUserToDelete = "";
    let idUserNameToDelete = "";

    if(user) {
        idUserToDelete = user.id;
        idUserNameToDelete = user.username;
    } else {
        idUserToDelete = message.author.id;
        idUserNameToDelete = message.author.username;
    }
    const rows = await promisify(sheet.getRows)({
        query: `identifiant = ${idUserToDelete}`
    })

    if(rows[0]){
        rows[0].del();
        message.channel.send('> ' + idUserNameToDelete + ' n`est plus enregistré.');
    } else {
        message.channel.send('> ' + idUserNameToDelete + ' n`a jamais été enregistré.');
    }   
}

// MESSAGE DU BOT ***************************//
bot.on('message', function(message){
    if(help.match(message)) {
        return help.action(message)
    }    
    if(message.content === 'md.tw_assignation'){
        // Récupérer la liste des membres
        const members = message.channel.guild.members.cache;
        accessSpreadsheet(message,members);
    }
    if(message.content.startsWith('md.r')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        registerMember(message, user);
    }
    if(message.content.startsWith('md.ur')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        unregisterMember(message, user);
    }
})

// FUNCTION *************************//
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
        
		return mention;
	}
}
