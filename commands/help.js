module.exports = class help {

    static match (message) {
        let messageContentHelp = message.content.toLowerCase();
        return messageContentHelp.startsWith('md.help');
    }

    static action (message) {
        message.channel.send('\n**Menu Aide - Maiden Bot (GVG Baguette)**\n\n| **Pour les Baguettes Corelliennes**\n\n| **md.addCor** (tagDiscord optionel) : Vous enregistre auprès du bot.\n\n| **md.delCor** (tagDiscord optionel) : Vous supprimer auprès du bot.\n\n| **md.assignCor** : Envoi par MP les assignations de pose en défense pour les joueurs participant à la TW.\n\n| **md.squad ** : Liste joueur par escouade - Renvoie la liste des joueurs inscrits auprès du bot pour la guilde.\n\n| **md.pdf** tagDiscord : Liste le plan de farm conseillé pour la guilde.\n\n\n| **Pour les Baguettes Rebelles**\n\n| **md.addReb** (tagDiscord optionel)\n\n| **md.delReb** (tagDiscord optionel)\n\n| **md.assignReb**\n\n\n| **Pour les Baguettes Resistantes**\n\n| **md.addRes** (tagDiscord optionel)\n\n| **md.delRes** (tagDiscord optionel)\n\n| **md.assignRes**\n\n\n| **Pour les Baguettes Séparatistes**\n\n| **md.addSepa** (tagDiscord optionel)\n\n| **md.delSepa** (tagDiscord optionel)\n\n| **md.assignSepa**\n\n');
    }
}