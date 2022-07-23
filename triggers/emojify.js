const emojis = require("../data/emojis.json");
const { pick } = require("../util");

module.exports = {
    name: "emojify",
    priority: 100,
    frequency: 0.003,
    handle: (bot, message) => {
        if(message.content.split(/\s+/).length > 3) {
            const emojified = message.content.replace(/\s+/g, () => ` :${pick(emojis)}: `);
            message.channel.send(emojified).catch(console.error);
        }
    }
};