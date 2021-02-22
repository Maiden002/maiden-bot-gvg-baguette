module.exports = class listPlayer {

    static match (message) {
        let messageContentHelp = message.content.toLowerCase();
        return messageContentHelp.startsWith('md.lp');
    }
}