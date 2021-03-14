const {datafile} = require("../util.js");
const data = datafile("./data/fake-facts.json", ["The fake facts datafile is missing!"]);

module.exports = {
    name: "ff",
    description: "Shows a fake fact",
    args: "[number]",
    handle: (bot, message, tokens) => {
        const number = tokens.length == 1 ? Number(tokens[0]) : Math.floor(Math.random() * data.length);
        if(number > data.length) {
            message.channel.send("There aren't that many fake facts yet.").catch(console.error);
        } else {
            message.channel.send(`DID YOU KNOW: ${data[number]} (#${number})`).catch(console.error);
        }
        return true;
    }
};