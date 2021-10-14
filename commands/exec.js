const Discord = require("discord.js");
const {CommandSyntaxError} = require("../command-reader");

module.exports = {
    name: "exec",
    description: "Runs JavaScript code",
    args: "<code>",
    privileged: true,
    handle: (bot, message) => {

        try {

            const body = message.content.match(/```(.+)```/s)?.[1];
            if(!body) throw new CommandSyntaxError("Couldn't locate JS code to run");

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
            
            message.reply({embeds: [embed]}).catch(console.error);

        } catch(error) {
            message.reply("`" + error + "`").catch(console.error);
        }

    }
};