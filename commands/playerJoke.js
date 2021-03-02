module.exports = class playerJoke {

    static match (message) {
        let messageContentHelp = message.content.toLowerCase();
        return messageContentHelp.startsWith('md.i');
    }

    static action (message, username) {
        let pseudo = username.toLowerCase();
        if(pseudo.includes('maiden')){
            message.channel.send("Maiden est votre chef Suprême !");
        } else if (pseudo.includes('nacx')){
            message.channel.send("Nacx est un bot que personne ne connaît !"); 
        } else if (pseudo.includes('diarrhee')){
            message.channel.send("Dark Diarrhée est le seigneur de la sainte Chiasse !")
        } else if (pseudo.includes('djo')){
            message.channel.send("Djo est la seule et unique personne à martyriser jour et nuit Nacx !")
        } else if (pseudo.includes('valphor')){
            message.channel.send("Si tu passes pas l'Acklay, soit sur que Valphor sera dérrière toi !")
        } else if (pseudo.includes('gamatown')){
            message.channel.send("Gamatown est l'homme qui râle le plus vite que son ombre !")
        } else if (pseudo.includes('bmd')){
            message.channel.send(`BMD n'est pas le nom d'une maladie sexuelle, rassurez-vous !`)
        } else if (pseudo.includes('cheewrielle')){
            message.channel.send(`Si tu dis Apéro, beuverie, sexe, barbeuc, pinard ou levrette. Tu peux être sur que Cheewrielle rapplique !`)
        } else if (pseudo.includes('yodark')){
            message.channel.send(`Le seul gars qui ne fait pas parti de la guilde et que pourtant tout le monde le pense. C'est Yodark !`)
        } else if (pseudo.includes('bimbaow')){
            message.channel.send(`Un GL de plus et vous pouvez tous l'appelez la Bimbo !`)
        } else if (pseudo.includes('servel')){
            message.channel.send(`Ticket bordel !`)
        } else if (pseudo.includes('orphelin')){
            message.channel.send(`Soit en sur ! La guilde est désolé de ne pas pouvoir te considéré en tant que tel !`)
        } else if (pseudo.includes('seb')){
            message.channel.send(`Dans le milieu, on l'appel le Lucky Luke des pelotons ! Tu ne seras jamais aussi rapide que lui !`)
        } else if (pseudo.includes('strike')){
            message.channel.send(`C'est bien le seul qui, dans la vraie vie, soigne des Rancors !`)
        } 
    }
}