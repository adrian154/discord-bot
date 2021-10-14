const {datafile} = require("../util.js");
const data = datafile("./data/fake-facts.json", ["The fake facts datafile is missing!"]);

module.exports = {
    name: "fakefact",
    aliases: ["ff"],
    description: "Shows a fake fact",
    args: "[number]",
    handle: (bot, message, reader) => {

        const number = reader.readToken(Math.floor(Math.random() * data.length));

        if(number > data.length) {
            message.reply("There aren't that many fake facts yet.").catch(console.error);
        } else {
            message.channel.send(`DID YOU KNOW: ${data[number]} (#${number})`).catch(console.error);
        }

    }
};