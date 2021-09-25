const {parseMention} = require("../util.js");
const config = require("../config.json");

module.exports = {
    name: "dc",
    description: "Allows you to buy or sell DrainCoin",
    args: "buy|sell <amount>|max",
    handle: (bot, message, tokens) => {

        const price = bot.drainCoin.getPrice();
        if(tokens.length == 0) {
            message.channel.send(`DrainCoin is at \$${price.toFixed(2)}.\nTrack live DrainCoin prices at ${config.draincoin.trackerURL}`).catch(console.error);
            return true;
        } else if(tokens.length == 2) {

            const balance = bot.userData.getBalance(message.author.id), draincoin = bot.userData.getDrainCoin(message.author.id);
            const action = tokens[0]; 
            
            if(action == "buy") {
                const amount = tokens[1] === "max" ? Math.floor(balance / price) : Number(tokens[1]);
                if(!amount || amount * price > balance) {
                    message.reply(`You don't have enough money to complete this transaction.`).catch(console.error);
                    return true;
                }
                bot.userData.setDrainCoin(message.author.id, draincoin + amount);
                bot.userData.setBalance(message.author.id, balance - amount * price);
                message.channel.send(`**${message.author.username}** bought **${amount}** DrainCoin for **\$${Number(amount * price).toFixed(2)}**`);
                return true;
            } else if(action === "sell") {
                const amount = tokens[1] === "max" ? draincoin : Number(tokens[1]);
                if(!amount || amount > draincoin) {
                    message.reply(`You don't have enough DrainCoin to complete that transaction.`).catch(console.error);
                    return true;
                }
                bot.userData.setDrainCoin(message.author.id, draincoin - amount);
                bot.userData.setBalance(message.author.id, balance + amount * price);
                message.channel.send(`**${message.author.username}** sold **${amount}** DrainCoin for **\$${Number(amount * price).toFixed(2)}**`);
                return true;
            }

        }

        return false;

    }
};