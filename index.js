const Discord = require("discord.js");

const bot = new Discord.Client();
const help = require('./commands/help')
const aide = require('./commands/aide')
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
const { exec } = require("child_process");

let testRegister = true;

// MESSAGE DU BOT ***************************//
bot.on('message', function(message){
    let messageContent = message.content.toLowerCase();

    // ---------- HELP
    if(help.match(message)) {
        return help.action(message);
    }

    // ---------- HELP REBELLE
    if(aide.match(message)) {
        return aide.action(message);
    }
    
    // ---------- LISTE PLAYER
    if(listPlayer.match(message)) {
        const members = message.channel.guild.members.cache;
        accessListPlayer(message, members);
    }  
    
    // ---------- ASSIGNATION TW
    if(messageContent === 'md.assigncor'){
        // Récupérer la liste des membres
        const members = message.channel.guild.members.cache;
        assignationTW_Corellien(message,members);
    }

    // ---------- Liste joueurs par escouade
    if(messageContent === 'md.squad'){
        // Récupérer la liste des membres
        const members = message.channel.guild.members.cache;
        printBySquad_Corellien(message,members);
    }

    // ---------- Plan de Farm Cor
    if(messageContent.startsWith('md.pdf')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        planDeFarmMember(message, user);
    }

    /*****************
     * 
     * Les Baguettes Corellienes
     * 
     ******************/

    // ---------- INSCRIPTION CORELLIEN
    if(messageContent.startsWith('md.addcor')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        registerMember(message, user);
    }

    // ---------- DESINSCRIPTION CORELLIEN
    if(messageContent.startsWith('md.delcor')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        unregisterMember(message, user);
    }

    /*****************
     * 
     * Les Baguettes Rebelles
     * 
     ******************/

    // ---------- INSCRIPTION REBELLE
    if(messageContent.startsWith('md.addreb')){
        const withoutPrefix = message.content.slice(prefix.length);
        const split = withoutPrefix.split(/ +/);
        const command = split[0];
        const args = split.slice(1);
    
        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        registerMemberRebelle(message, user);
    }

    // ---------- DESINSCRIPTION REBELLE
    if(messageContent.startsWith('md.delreb')){
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

    /*****************
     * 
     * Les Baguettes Resistantes
     * 
     ******************/

    // ---------- INSCRIPTION RESISTANTS
    if(messageContent.startsWith('md.addres')){
        const withoutPrefix = message.content.slice(prefix.length);
        const split = withoutPrefix.split(/ +/);
        const command = split[0];
        const args = split.slice(1);
    
        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        registerMemberResistants(message, user);
    }

    // ---------- DESINSCRIPTION RESISTANTS
    if(messageContent.startsWith('md.delres')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        unregisterMemberResistants(message, user);
    }

    // ---------- ASSIGNATION TW RESISTANTS
    if(messageContent === 'md.assignres'){
        // Récupérer la liste des membres
        const members = message.channel.guild.members.cache;
        assignationTW_Resistants(message,members);
    }

    /*****************
     * 
     * Les Baguettes Séparatistes
     * 
     ******************/

    // ---------- INSCRIPTION SEPARATISTES
    if(messageContent.startsWith('md.addsepa')){
        const withoutPrefix = message.content.slice(prefix.length);
        const split = withoutPrefix.split(/ +/);
        const command = split[0];
        const args = split.slice(1);
    
        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        registerMemberSeparatistes(message, user);
    }

    // ---------- DESINSCRIPTION SEPARATISTES
    if(messageContent.startsWith('md.delsepa')){
        const withoutPrefix = message.content.slice(prefix.length);
	    const split = withoutPrefix.split(/ +/);
	    const command = split[0];
	    const args = split.slice(1);

        const user = message.guild.members.cache.get(getUserFromMention(args[0]));
        unregisterMemberSeparatistes(message, user);
    }

    // ---------- ASSIGNATION TW SEPARATISTES
    if(messageContent === 'md.assignsepa'){
        // Récupérer la liste des membres
        const members = message.channel.guild.members.cache;
        assignationTW_Separatistes(message,members);
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

function printPlayer (player, message) {

    console.log(`Hello : ${player.player}`);
    console.log(`${player._dw4je}`);
    message.reply(`Hello ${player.player} Voici ta défense TW : ${player._dw4je}`);
    // _dw4je vaut la valeur concatené des teams a poser
    console.log('----------------------');
}

async function assignationTW_Corellien(message, members) {
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
        message.channel.send('> ' + userNameToInsert + ' est maintenant enregistré pour Les Baguettes Corelliennes.');
    } else {
        message.channel.send('> ' + userNameToInsert + ' est déjà enregistré pour Les Baguettes Corelliennes.');
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
        message.channel.send('> ' + idUserNameToDelete + ' n`est plus enregistré pour Les Baguettes Corelliennes.');
    } else {
        message.channel.send('> ' + idUserNameToDelete + ' n`a jamais été enregistré pour Les Baguettes Corelliennes.');
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

async function printBySquad_Corellien(message, members) {
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
.setDescription('Liste des joueurs des Baguettes Corelliennes par escouades')
.setThumbnail('https://cdn.discordapp.com/app-icons/811619848022786089/8d9fb17a9e32751934f57a65ad8f5f91.png')
.setTimestamp()
.setFooter('Maiden Bot', 'https://cdn.discordapp.com/app-icons/811619848022786089/8d9fb17a9e32751934f57a65ad8f5f91.png');

let nbPlayerDelta = 0;
let nbPlayerGold = 0;
let nbPlayerRogue = 0;
let nbPlayerRed = 0;
let nbPlayerSabre = 0;

let lstVide = "";
let listMembersDelta = "";
let listMembersGold = "";
let listMembersRogue = "";
let listMembersSabre = "";
let listMembersRed = "";

let count = 1;
rowMembers.forEach(row => {
    if(row.escouade == "Delta") {
        listMembersDelta = listMembersDelta + `| ${row.allycode} - ${row.ingame} - <@${row.identifiant}>\n`;
        nbPlayerDelta = nbPlayerDelta +1;
    } else if(row.escouade == "Gold") {
        listMembersGold = listMembersGold + `| ${row.allycode} - ${row.ingame} - <@${row.identifiant}>\n`;
        nbPlayerGold = nbPlayerGold +1;
    } else if(row.escouade == "Sabre") {
        listMembersSabre = listMembersSabre + `| ${row.allycode} - ${row.ingame} - <@${row.identifiant}>\n`;
        nbPlayerSabre = nbPlayerSabre +1;
    } else if(row.escouade == "Red") {
        listMembersRed = listMembersRed + `| ${row.allycode} - ${row.ingame} - <@${row.identifiant}>\n`;
        nbPlayerRed = nbPlayerRed +1;
    } else if(row.escouade == "Rogue") {
        listMembersRogue = listMembersRogue + `| ${row.allycode} - ${row.ingame} - <@${row.identifiant}>\n`;
        nbPlayerRogue = nbPlayerRogue +1;
    } 
    
    count = count + 1 ;
});
    if(listMembersDelta){
        guildEmbed.addField(`**Membres de l'escouade DELTA ${nbPlayerDelta}/10**`, listMembersDelta);
        guildEmbed.addField(`**Membres de l'escouade GOLD ${nbPlayerGold}/10**`, listMembersGold);
        guildEmbed.addField(`**Membres de l'escouade SABRE ${nbPlayerSabre}/10**`, listMembersSabre);
        guildEmbed.addField(`**Membres de l'escouade RED ${nbPlayerRed}/10**`, listMembersRed);
        guildEmbed.addField(`**Membres de l'escouade ROGUE ${nbPlayerRogue}/10**`, listMembersRogue);
    }

    message.channel.send(guildEmbed)
}

async function planDeFarmMember(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY);
    
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[12];
    const sheetMemberslst = info.worksheets[10];
    
    if(user){
        const rowMembers = await promisify(sheetMemberslst.getRows)({
            offset: 1
        });
        
        const rows = await promisify(sheet.getRows)({
            offset: 1
        });

        let planDeFarm = "";
        let messageFarm = "";
        rowMembers.forEach(member => {
            if(member.username === user.user.username){
                planDeFarm = `\n**Plan de farm conseillé pour ${member.ingame}**\n\n`;

                rows.forEach(row => {
                    let player = row.joueur;
                    if(player === member.ingame){
                        let pdf1 = row.pdf1;
                        let pdf2 = row.pdf2;
                        let pdf3 = row.pdf3;
                        let pdf4 = row.pdf4;
                        let pdf5 = row.pdf5;
                        let pdf6 = row.pdf6;
                        let pdf7 = row.pdf7;
                        let pdf8 = row.pdf8;
                        let pdf9 = row.pdf9;
                        let pdf10 = row.pdf10;
                        let pdf11 = row.pdf11;
                        let pdf12 = row.pdf12;
                        let pdf13 = row.pdf13;
                        let pdf14 = row.pdf14;
                        let pdf15 = row.pdf15;
                        let pdf16 = row.pdf16;
                        let pdf17 = row.pdf17;
                        let pdf18 = row.pdf18;
                        let pdf19 = row.pdf19;
                        let pdf20 = row.pdf20;

                        let message = "";

                        if(pdf1 != 'NA'){ message = " - " + pdf1 + "\n" }

                        if(pdf2 != 'NA'){ message = message + " - " + pdf2 + "\n" }
                        if(pdf3 != 'NA'){ message = message + " - " + pdf3 + "\n" }
                        if(pdf4 != 'NA'){ message = message + " - " + pdf4 + "\n" }
                        if(pdf5 != 'NA'){ message = message + " - " + pdf5 + "\n" }
                        if(pdf6 != 'NA'){ message = message + " - " + pdf6 + "\n" }
                        if(pdf7 != 'NA'){ message = message + " - " + pdf7 + "\n" }
                        if(pdf8 != 'NA'){ message = message + " - " + pdf8 + "\n" }
                        if(pdf9 != 'NA'){ message = message + " - " + pdf9 + "\n" }
                        if(pdf10 != 'NA'){ message = message + " - " + pdf10 + "\n" }
                        if(pdf11 != 'NA'){ message = message + " - " + pdf11 + "\n" }
                        if(pdf12 != 'NA'){ message = message + " - " + pdf12 + "\n" }
                        if(pdf13 != 'NA'){ message = message + " - " + pdf13 + "\n" }
                        if(pdf14 != 'NA'){ message = message + " - " + pdf14 + "\n" }
                        if(pdf15 != 'NA'){ message = message + " - " + pdf15 + "\n" }
                        if(pdf16 != 'NA'){ message = message + " - " + pdf16 + "\n" }
                        if(pdf17 != 'NA'){ message = message + " - " + pdf17 + "\n" }
                        if(pdf18 != 'NA'){ message = message + " - " + pdf18 + "\n" }
                        if(pdf19 != 'NA'){ message = message + " - " + pdf19 + "\n" }
                        if(pdf20 != 'NA'){ message = message + " - " + pdf20 + "\n" }
                        
                        if(message != ''){
                            message = message + "\nEssaye de faire au mieux mais ça serait bien d'obtenir ces niveaux de relique pour ces personnages là."
                        } else {
                            message = "A l'heure actuelle tu n'as pas de farm conseillé pour la guilde."
                        }
                        messageFarm = message;
                    }
                })
            }   
        })
        planDeFarm = planDeFarm + messageFarm;
        message.channel.send(planDeFarm);
    } 
}

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

//****** PROPRE AUX RESISTANTS */
async function registerMemberResistants(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_RESISTANTS);
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
        message.channel.send('> ' + userNameToInsert + ' est maintenant enregistré pour Les Baguettes Resistantes.');
    } else {
        message.channel.send('> ' + userNameToInsert + ' est déjà enregistré pour Les Baguettes Resistantes.');
    }
}

async function unregisterMemberResistants(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_RESISTANTS);
    
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
        message.channel.send('> ' + idUserNameToDelete + ' n`est plus enregistré pour Les Baguettes Resistantes.');
    } else {
        message.channel.send('> ' + idUserNameToDelete + ' n`a jamais été enregistré pour Les Baguettes Resistantes.');
    }   
}

async function assignationTW_Resistants(message, members) {
    console.log('Debut');
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_RESISTANTS);
    
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

//****** PROPRE AUX SEPARATISTES */
async function registerMemberSeparatistes(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_SEPARATISTE);
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
        message.channel.send('> ' + userNameToInsert + ' est maintenant enregistré pour Les Baguettes Séparatistes.');
    } else {
        message.channel.send('> ' + userNameToInsert + ' est déjà enregistré pour Les Baguettes Séparatistes.');
    }
}

async function unregisterMemberSeparatistes(message, user) {
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_SEPARATISTE);
    
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
        message.channel.send('> ' + idUserNameToDelete + ' n`est plus enregistré pour Les Baguettes Séparatistes.');
    } else {
        message.channel.send('> ' + idUserNameToDelete + ' n`a jamais été enregistré pour Les Baguettes Séparatistes.');
    }   
}

async function assignationTW_Separatistes(message, members) {
    console.log('Debut');
    const doc = new GoogleSpreadsheet(process.env.SHEETKEY_SEPARATISTE);
    
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
