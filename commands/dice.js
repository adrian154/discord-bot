module.exports = {
    name: "dice",
    description: "Rolls dice",
    args: "[<count>d<range>]",
    handle: (bot, message, tokens) => {

        const dice = tokens[0] ?? "1d6";
        
        const [numRolls, range] = dice.split("d").map(Number);
        if(!numRolls || !range) {
            return false;
        }

        const rolls = [];
        for(let i = 0; i < numRolls; i++) {
            rolls.push(Math.floor(Math.random() * range) + 1);
        }

        message.channel.send("You rolled: " + rolls.join(", ")).catch(console.error);
        return true;

    }
};