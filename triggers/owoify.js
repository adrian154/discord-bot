const config = require("../config.json").bot.triggers.owoify;

const owoify = string => {
    return string.replace(/[rl]/g, "w")
                 .replace(/\s+/g, () => Math.random() < 0.2 ? util.pick([" *sweats* ", ".. ", " UwU ", " OwO ", " x\"3 ", " :3 "]) : " ")
                 .replace("!", "!".repeat(Math.random() * 6 + 2) + "1".repeat(Math.random() * 3 + 1));
};

module.exports = {
    name: "owoify",
    handle: (bot, message) => {
        const owoified = owoify(message.content);
        if(Math.random() < config.frequency && owoified !== message) {
            message.channel.send(owoified).catch(console.error);
            return true;
        }
    }
};