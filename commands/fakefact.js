const Discord = require("discord.js");

const data = (() => {
    try {
        return require("../data/fake-facts.json");
    } catch(error) {
        console.error(error);
        return [];
    }
})();

module.exports = {
    name: "ff",
    description: "Shows a fake fact",
    usage: "ff",
    handle: async (bot, message) => {
        message.channel.send(data[Math.floor(Math.random() * data.length)]).catch(console.error);
    }
};