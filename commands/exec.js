const Discord = require("discord.js");
const {CommandSyntaxError} = require("../command-reader");

// for some reason AsyncFunction is not global
const AsyncFunction = (async () => {}).constructor;

module.exports = {
    name: "exec",
    description: "Runs JavaScript code",
    args: "<code>",
    privileged: true,
    handle: async (bot, message) => {

        try {

            const body = message.content.match(/```(.+)```/s)?.[1];
            if(!body) throw new CommandSyntaxError("Couldn't locate JS code to run");

            // pass "console" object as variable
            const consoleOutput = [];
            const func = new AsyncFunction("console", "require", "bot", body); 

            try {

                const result = await func(
                    {log: (...params) => consoleOutput.push(params.join(" "))}, // console
                    require, // require
                    bot // bot
                );

                const embed = new Discord.MessageEmbed();
                embed.addField("Return value", "`" + result + "`");
                if(consoleOutput.length > 0) {
                    embed.addField("Console output", "```" + consoleOutput.join("\n") + "```");
                }
                
                message.reply({embeds: [embed]}).catch(console.error);

            } catch(error) {
                message.reply("```" + error.stack + "```");
            }

        } catch(error) {
            message.reply("`" + error + "`").catch(console.error);
        }

    }
};