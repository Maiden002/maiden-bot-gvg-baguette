module.exports = class aide {

    static match (message) {
        let messageContentAide = message.content.toLowerCase();
        return messageContentAide.startsWith('md.aide');
    }

    static action (message) {
        message.channel.send('\n**Menu Aide - Maiden Bot (GVG Baguette)**\n\n| **md.add** (tagDiscord optionel) : Vous enregistre auprès du bot. Pour enregistrer un autre joueur, ajouter son tag après la commande.\n\n| **md.del** (tagDiscord optionel) : Vous supprimer auprès du bot. Pour supprimer un autre joueur, ajouter son tag après la commande.\n\n| **md.assignReb** : Envoi par MP les assignations de pose en défense pour les joueurs participant à la TW.\n\n| **md.lp ** : Liste PLayer - Renvoie la liste des joueurs inscrits auprès du bot pour la guilde.\n');
    }
}