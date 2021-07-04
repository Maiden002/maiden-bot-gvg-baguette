module.exports = class help {

    static match (message) {
        let messageContentHelp = message.content.toLowerCase();
        return messageContentHelp.startsWith('md.help');
    }

    static action (message) {
        message.channel.send('\n**Menu Aide - Maiden Bot (GVG Baguette)**\n\n| **__```apache Pour les Baguettes Corelliennes```__**\n\n| **md.addCor** (tagDiscord optionel) : Vous enregistre auprès du bot.\n| **md.delCor** (tagDiscord optionel) : Vous supprimer auprès du bot.\n| **md.assignCor** : Envoi par MP les assignations de pose en défense pour les joueurs participant à la TW.\n| **md.squad ** : Liste joueur par escouade - Renvoie la liste des joueurs inscrits auprès du bot pour la guilde.\n| **md.pdf** tagDiscord : Liste le plan de farm conseillé pour la guilde.\n\n| **__Pour les Baguettes Rebelles__**\n\n| **md.addReb** (tagDiscord optionel)\n| **md.delReb** (tagDiscord optionel)\n| **md.assignReb**  : Envoie la pose en défense par MP\n\n| **__Pour les Baguettes Resistantes__**\n\n| **md.addRes** (tagDiscord optionel)\n| **md.delRes** (tagDiscord optionel)\n| **md.assignRes** : Envoie la pose en défense par MP\n\n| **__Pour les Baguettes Séparatistes__**\n| **md.addSepa** (tagDiscord optionel)\n| **md.delSepa** (tagDiscord optionel)\n| **md.assignSepa**  : Envoie la pose en défense par MP\n');
    }
}