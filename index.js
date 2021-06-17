const Discord = require("discord.js");

const bot = new Discord.Client();
const help = require('./commands/help')
const {prefix} = require("./config.json");

// DEMARRAGE DU BOT ***************************//
bot.on("ready", () => {
    console.log("Bot Maiden démarré");
    bot.user.setActivity('md.help | Préparation de la TW').catch(console.error)
})

bot.login(process.env.TOKEN);

// GOOGLE SHEET ***************************//
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');
const listPlayer = require("./commands/listPlayer");
const playerJoke = require("./commands/playerJoke");

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
    
    let recap = "```Les membres suivants ont reçus leurs poses en défense : ";

    rows.forEach(row => {
        let player = row._dw4je;
        let poseEnDef = row._dxj3v;
        
        rowMembers.forEach(row2 => {
            if(row2.username === player) {
                let identifiant = row2.identifiant;
                recap =  recap + player + ", ";
                    if (message.channel.type !== "text") return;
                    members.forEach(member => {
                        // Si le membre est un bot, l’ignorer
                        if (member.user.bot) return;
                        // Envoyer le message au membre
                        if(member.user.id === identifiant)
                            member.send(poseEnDef);  
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

async function accessListPlayer(message, members) {
    console.log('Debut - ListPlayer');
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheetMemberslst = info.worksheets[10];

    const rowMembers = await promisify(sheetMemberslst.getRows)({
        offset: 1
    });

    
const guildEmbed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Les Baguettes Corelliennes')
.setAuthor('Maiden Bot', 'https://cdn.discordapp.com/app-icons/811619848022786089/8d9fb17a9e32751934f57a65ad8f5f91.png', '')
.setDescription('Liste des joueurs des Baguettes Corelliennes')
.setThumbnail('https://cdn.discordapp.com/app-icons/811619848022786089/8d9fb17a9e32751934f57a65ad8f5f91.png')
.setTimestamp()
.setFooter('Maiden Bot', 'https://cdn.discordapp.com/app-icons/811619848022786089/8d9fb17a9e32751934f57a65ad8f5f91.png');

let nbPlayer = 0;
// Calcul du nombre de joueur présent 
rowMembers.forEach(row => {
    nbPlayer = nbPlayer + 1;
});

let listMembers = "";
let listMembers2 = "";
let listMembers3 = "";

let count = 1;
rowMembers.forEach(row => {
    if(count <= 20) {
        listMembers = listMembers + `| ${row.allycode} - ${row.username} - <@${row.identifiant}>\n`;
    } else if(count > 20 && count < 41) {
        listMembers2 = listMembers2 + `| ${row.allycode} - ${row.username} - <@${row.identifiant}>\n`;
    } else if(count > 40) {
        listMembers3 = listMembers3 + `| ${row.allycode} - ${row.username} - <@${row.identifiant}>\n`;
    } 
    
    count = count + 1 ;
});
    if(listMembers){
        guildEmbed.addField(`**Membres enregistrés ${nbPlayer}/50 :**`, listMembers);
    }
    if(listMembers2){
        guildEmbed.addField('** **', listMembers2);
    }
    if(listMembers3){
        guildEmbed.addField('** **', listMembers3);
    }

    message.channel.send(guildEmbed)
    console.log('Fin - ListPlayer');
}

// MESSAGE DU BOT ***************************//
bot.on('message', function(message){
    let messageContent = message.content.toLowerCase();
    // ---------- HELP
    if(help.match(message)) {
        return help.action(message);
    }
    
    // ---------- LISTE PLAYER
    if(listPlayer.match(message)) {
        const members = message.channel.guild.members.cache;
        accessListPlayer(message, members);
    }  
    
    // ---------- ASSIGNATION TW
    if(messageContent === 'md.tw_assignation'){
        // Récupérer la liste des membres
        const members = message.channel.guild.members.cache;
        accessSpreadsheet(message,members);
    }

    // ---------- INSCRIPTION CORELLIEN
    if(messageContent.startsWith('md.r')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        registerMember(message, user);
    }

    // ---------- DESINSCRIPTION CORELLIEN
    if(messageContent.startsWith('md.ur')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        unregisterMember(message, user);
    }

    // ---------- INSCRIPTION REBELLE
    if(messageContent.startsWith('md.add')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        registerMemberRebelle(message, user);
    }

    // ---------- DESINSCRIPTION REBELLE
    if(messageContent.startsWith('md.del')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        unregisterMemberRebelle(message, user);
    }

    // ---------- ASSIGNATION TW REBELLE
    if(messageContent === 'md.assignreb'){
        // Récupérer la liste des membres
        const members = message.channel.guild.members.cache;
        assignationTW_Rebelle(message,members);
    }

    // ---------- PLAYER JOKE
    if(playerJoke.match(message)) {
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        console.log(user.user.username);
        return playerJoke.action(message, user.user.username);
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

//****** PROPRE AUX REBELLES */
async function registerMemberRebelle(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_REBELLE);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[1];
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
        message.channel.send('> ' + userNameToInsert + ' est maintenant enregistré pour Les Baguettes Rebelles.');
    } else {
        message.channel.send('> ' + userNameToInsert + ' est déjà enregistré pour Les Baguettes Rebelles.');
    }
}

async function unregisterMemberRebelle(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_REBELLE);
    
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[1];
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
        message.channel.send('> ' + idUserNameToDelete + ' n`est plus enregistré pour Les Baguettes Rebelles.');
    } else {
        message.channel.send('> ' + idUserNameToDelete + ' n`a jamais été enregistré pour Les Baguettes Rebelles.');
    }   
}

async function assignationTW_Rebelle(message, members) {
    console.log('Debut');
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_REBELLE);
    
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[6];
    const sheetMemberslst = info.worksheets[1];

    const rows = await promisify(sheet.getRows)({
        query: '_cn6ca = FALSE'
    });

    const rowMembers = await promisify(sheetMemberslst.getRows)({
        offset: 1
    });
    
    let recap = "```Les membres suivants ont reçus leurs poses en défense : ";

    rows.forEach(row => {
        let player = row._cx0b9;
        let poseEnDef = row._d9ney;
        
        rowMembers.forEach(row2 => {
            if(row2.ingame === player) {
                let identifiant = row2.identifiant;
                recap =  recap + player + ", ";
                    if (message.channel.type !== "text") return;
                    members.forEach(member => {
                        // Si le membre est un bot, l’ignorer
                        if (member.user.bot) return;
                        // Envoyer le message au membre
                        if(member.user.id === identifiant)
                            member.send(poseEnDef);  
                        });
            }
        })
    })
    recap = recap + '```';
    message.channel.send(recap);
    
    console.log("Fin");
}