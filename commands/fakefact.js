const datafile = require("../datafile.js");
const data = datafile("./data/fake-facts.json", ["The fake facts datafile is missing!"]);

module.exports = {
    name: "ff",
    description: "Shows a fake fact",
    args: "[number]",
    handle: (bot, message, tokens) => {
        const number = Number(tokens[0]) ?? Math.floor(Math.random() * data.length);
        message.channel.send(`DID YOU KNOW: ${data[number]} (#${number})`).catch(console.error);
        return true;
    }
};