const {datafile} = require("../util.js");
const data = datafile("./data/fake-facts.json", ["The fake facts datafile is missing!"]);

module.exports = {
    name: "ff",
    description: "Shows a fake fact",
    usage: "ff [number]",
    handle: async (bot, message, tokens) => {

        const number = tokens.length > 0 ? parseInt(tokens[0]) : Math.floor(Math.random() * data.length);
        message.channel.send(`DID YOU KNOW: ${data[number]} (#${number})`).catch(console.error);
    
    }
};