const datafile = require("../datafile.js");
const data = datafile("./data/proverbs.json", ["The proverbs datafile is missing!"]);

module.exports = {
    name: "proverb",
    description: "Shows a wise proverb",
    handle: async (bot, message) => {
        message.channel.send(data[Math.floor(Math.random() * data.length)]).catch(console.error);
        return true;
    }
};