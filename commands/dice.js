module.exports = {
    name: "dice",
    description: "Rolls dice",
    usage: "dice [<count>d<range>]",
    handle: (bot, message, tokens) => {

        let dice = "1d6";
        if(tokens.length >= 2) {
            dice = tokens[0];
        }
        
        dice = dice.split("d");
        if(dice.length != 2) {
            message.channel.send("Invalid dice syntax").catch(console.error);
            return;
        }

        const numRolls = Number(dice[0]);
        const range = Number(dice[1]);

        if(!numRolls || !range) {
            message.channel.send("Invalid dice syntax").catch(console.error);
            return;
        }

        const rolls = [];
        for(let i = 0; i < numRolls; i++) {
            rolls.push(Math.floor(Math.random() * range) + 1);
        }

        message.channel.send("You rolled: " + rolls.join(", ")).catch(console.error);

    }
};