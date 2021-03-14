const util = require("../util.js");

const owoify = string => {
    return string.replace(/[rl]/g, "w")
                 .replace(/\s+/g, () => Math.random() < 0.2 ? util.pick([" *sweats* ", ".. ", " UwU ", " OwO ", " x\"3 ", " :3 "]) : " ")
                 .replace("!", "!".repeat(Math.random() * 6 + 2) + "1".repeat(Math.random() * 3 + 1));
};

module.exports = {
    name: "owoify",
    frequency: 0.1,
    handle: (bot, message) => {
        const owoified = owoify(message.content);
        if(owoified !== message) {
            message.channel.send(owoified).catch(console.error);
            return true;
        }
    }
};