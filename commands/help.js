module.exports = class help {

    static match (message) {
        return message.content.startsWith('md.help')
    }

    static action (message) {
        message.reply('Bot Maiden - TW Baguette - Aide');
    }
}