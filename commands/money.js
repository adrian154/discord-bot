const {parseMention} = require("../util.js");

module.exports = {
    name: "money",
    description: "Controls the bot economy",
    privileged: true,
    args: "give|set <user> <amount> OR <user>",
    handle: (bot, message, tokens) => {

        const subcommand = tokens[0];
        const userID = parseMention(tokens[1]);
        const amount = Number(tokens[2]);
        if(!userID || !amount) return false;
        if(subcommand === "give") {
            const newBalance = bot.userData.getBalance(userID) + amount;
            bot.userData.setBalance(userID, newBalance);
            message.reply(`Added \$${amount} to that user's account, their balance is now ${newBalance}`).catch(console.error);
        } else if(subcommand === "set") {
            bot.userData.setBalance(userID, amount);
            message.reply(`Set that user's balance to \$${amount}`).catch(console.error);
        } else {
            return false;
        }

        return true;

    }
};