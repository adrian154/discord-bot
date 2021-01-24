const prose = require("../prose.js");

module.exports = {
    name: "haiku",
    usage: "haiku",
    description: "Generates a haiku",
    handle: (bot, message) => {
        message.channel.send("```" + prose.createHaiku() + "```").catch(console.error);
    }
};