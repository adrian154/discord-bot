const {parseMention} = require("../util.js");

module.exports = {
    name: "bal",
    description: "Allows you to manage your money",
    args: "give <user> <amount> OR <user>",
    handle: (bot, message, tokens) => {

        if(tokens.length < 2) {
            const id = tokens[0] ? parseMention(tokens[0]) : message.author.id;
            if(!id) return false;
            message.channel.send(`Balance: \$${bot.userData.getBalance(id).toFixed(2)} and ${bot.userData.getDrainCoin(id)} DrainCoin`);
            return true;
        }

        const subcommand = tokens[0];
        const userID = parseMention(tokens[1]);
        const amount = Number(tokens[2]);
        if(!userID || !amount || amount < 0) return false;
        if(subcommand === "give") {
            if(bot.userData.getBalance(message.author.id) < amount) {
                message.channel.send("You don't have enough money to do that.").catch(console.error);
                return;
            }
            bot.userData.setBalance(userID, bot.userData.getBalance(userID) + amount);
            bot.userData.setBalance(message.author.id, bot.userData.getBalance(message.author.id) - amount);
            message.channel.send(`Sent ${amount} to that user.`).catch(console.error);
        } else {
            return false;
        }

        return true;

    }
};