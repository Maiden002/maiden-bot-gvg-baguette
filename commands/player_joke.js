module.exports = class playerJoke {

    static match (message) {
        let messageContentHelp = message.content.toLowerCase();
        return messageContentHelp.startsWith('md.i');
    }

    static action (message, username) {
        if('maiden'.includes(username)){
            message.channel.send("Maiden est votre chef Suprême !");
        } else if ('nacx'.includes(username)){
            message.channel.send("Nacx est un bot que personne ne connaît !"); 
        } else if ('Diarrhee'.includes(username)){
            message.channel.send("Dark Diarrhée est le seigneur de la sainte Chiasse !")
        }
    }
}