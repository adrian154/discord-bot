const {CommandSyntaxError} = require("../command-reader");

module.exports = {
    name: "dice",
    aliases: ["d"],
    description: "Rolls dice",
    args: "NdM (N = number of die, M = dice range)",
    handle: (bot, message, reader) => {
        
        const [numRolls, range] = reader.readToken("1d6").split("d").map(Number);
        if(!numRolls || !range) {
            throw new CommandSyntaxError("Invalid dice");
        }

        const rolls = [];
        for(let i = 0; i < numRolls; i++) {
            rolls.push(Math.floor(Math.random() * range) + 1);
        }

        message.reply("You rolled: " + rolls.join(", ")).catch(console.error);

    }
};