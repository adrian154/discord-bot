const {parseMention} = require("../util.js");

module.exports = {
    name: "bal",
    description: "Allows you to manage your money",
    args: "give|set <user> <amount> OR <user>",
    handle: (bot, message, tokens) => {

        if(tokens.length == 0) {
            message.channel.send(`Balance: ${bot.userData.getBalance(message.author.id)}`)
        } else if(tokens.length == 1) {
            const userID = parseMention(tokens[0]);
            message.channel.send(`Balance: ${bot.userData.getBalance(userID)}`);
        } else {
            const subcommand = tokens[0];
            const userID = parseMention(tokens[1]);
            const amount = Number(tokens[2]);
            if(!userID || !amount) return false;
            if(subcommand === "give") {
                if(bot.userData.getBalance(userID) < amount) {
                    message.channel.send("You don't have enough money to do that.").catch(console.error);
                    return;
                }
                bot.userData.setBalance(userID, bot.userData.getBalance(userID) + amount);
                bot.userData.setBalance(message.author.id, bot.userData.getBalance(message.author.id) - amount);
                message.channel.send(`Sent ${amount} to that user.`).catch(console.error);
            } else {
                return false;
            }
        }

        return true;

    }
};