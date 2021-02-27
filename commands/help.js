module.exports = class help {

    static match (message) {
        let messageContentHelp = message.content.toLowerCase();
        return messageContentHelp.startsWith('md.help');
    }

    static action (message) {
        message.channel.send('\n**Menu Aide - Maiden Bot (GVG Baguette)**\n\n| **md.r** (tagDiscord optionel) : Vous enregistre auprès du bot. Pour enregistrer un autre joueur, ajouter son tag après la commande.\n\n| **md.ur** (tagDiscord optionel) : Vous supprimer auprès du bot. Pour supprimer un autre joueur, ajouter son tag après la commande.\n\n| **md.tw_assignation** : Envoi par MP les assignations de pose en défense pour les joueurs participant à la TW.\n\n| **md.lp ** : Liste PLayer - Renvoie la liste des joueurs inscrits auprès du bot pour la guilde.\n');
    }
}