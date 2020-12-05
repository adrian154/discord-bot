module.exports = {
    name: "dice",
    description: "Rolls dice",
    usage: "dice [<count>d<range>]",
    handle: (bot, message) => {
  
        let tokens = message.content.split(" ");
        
        let dice = "1d6";
        if(tokens.length >= 2) {
            dice = split[1];
        }
        
        dice = dice.split("d");
        if(dice.length != 2) {
            message.channel.send("Invalid dice syntax");
        }

        let numRolls = Number(params[0]);
        let range = Number(params[1]);

        let rolls = [];
        for(let i = 0; i < numRolls; i++) {
            rolls.push(Math.floor(Math.random() * range) + 1);
        }

        message.channel.send("You rolled: " + rolls.join(", "));

    }
};