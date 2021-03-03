const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Provides helpful advice",
    usage: "help [command]",
    handle: (bot, message, tokens) => {

        if(tokens.length == 1) {
            
            const command = bot.getCommand(tokens[0], message.author, message.guild);
            if(command) {
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle(`Help for \`${command.name}\``)
                        .setDescription(command.description)
                        .addField("Usage", "`" + command.usage + "`")
                ).catch(console.error);
            } else {
                message.channel.send(`I don't know a command named "${tokens[0]}". Try running \`help\` without any parameters to see a list of commands.`).catch(console.error);
            }

        } else {
        
            const commands = [];
        
            for(let command of Object.values(bot.commands)) {
                command = bot.getCommand(command.name, message.author, message.guild);
                if(command) {
                    commands.push(`\`${command.name}\`: ${command.description}`);
                }
            }

            message.channel.send(commands.join("\n") + "\nSpecify a command when running \`help\` for usage and specific info.").catch(console.error).catch(console.error);
        
        }

    }
};