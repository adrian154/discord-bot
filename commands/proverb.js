const {datafile} = require("../util.js");
const data = datafile("./data/idioms.json", ["The idioms datafile is missing!"]);

module.exports = {
    name: "idiom",
    description: "id",
    args: "[number]",
    handle: (bot, message, reader) => {

        const number = reader.readToken(Math.floor(Math.random() * data.length));

        if(number > data.length) {
            message.reply("There aren't that many idioms yet.").catch(console.error);
        } else {
            message.channel.send(`${data[number]} (#${number})`).catch(console.error);
        }

    }
};