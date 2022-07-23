const { pick } = require("../util.js");
const util = require("../util.js");

const owoify = string => {
    return string.replace(/[rl]/g, "w")
                 .replace(/\s+/g, () => Math.random() < 0.2 ? util.pick([" *sweats* ", ".. "]) : " ")
                 .replace("!", "!".repeat(Math.random() * 6 + 2) + "1".repeat(Math.random() * 3 + 1)) +
                 " " + pick(["UwU", "OwO", "x\"3", ":3"]);
};

module.exports = {
    name: "owoify",
    priority: 10,
    frequency: 0.005,
    handle: (bot, message) => {
        const owoified = owoify(message.content);
        if(owoified !== message.content) {
            message.channel.send(owoified).catch(console.error);
            return true;
        }
    }
};