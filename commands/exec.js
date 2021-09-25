const Discord = require("discord.js");

module.exports = {
    name: "exec",
    description: "Runs JavaScript code",
    args: "<code>",
    privileged: true,
    handle: (bot, message, tokens) => {

        try {

            const body = message.content.match(/```(.+)```/s)?.[1];
            if(!body) return false;

            // pass "console" object as variable
            const consoleOutput = [];
            const func = new Function("console", "require", body); 

            const result = func(
                {
                    log: (...params) => {
                        consoleOutput.push(params.join(" "));
                    }
                },
                require
            );

            const embed = new Discord.MessageEmbed();
            embed.addField("Return value", "`" + result + "`");
            if(consoleOutput.length > 0) {
                embed.addField("Console output", "```" + consoleOutput.join("\n") + "```");
            }
            
            message.channel.send({embeds: [embed]}).catch(console.error);

        } catch(error) {
            message.channel.send("`" + error + "`");
        }

        return true;

    }
};