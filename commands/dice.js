module.exports = {
    name: "dice",
    description: "Rolls dice",
    usage: "dice [<count>d<range>]",
    handle: (bot, message) => {
  
        let tokens = message.content.split(" ");
        
        let dice = "1d6";
        if(tokens.length >= 2) {
            dice = tokens[1];
        }
        
        dice = dice.split("d");
        if(dice.length != 2) {
            message.channel.send("Invalid dice syntax").catch(console.error);
            return;
        }

        let numRolls = Number(dice[0]);
        let range = Number(dice[1]);

        if(!numRolls || !range) {
            message.channel.send("Invalid dice syntax").catch(console.error);
            return;
        }

        let rolls = [];
        for(let i = 0; i < numRolls; i++) {
            rolls.push(Math.floor(Math.random() * range) + 1);
        }

        message.channel.send("You rolled: " + rolls.join(", ")).catch(console.error);

    }
};