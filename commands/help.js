const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Provides helpful advice",
    args: "[command]",
    handle: (bot, message, tokens) => {

        if(tokens.length == 1) {
            
            const command = bot.getCommand(tokens[0], message.author, message.guild);
            if(command) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Help for \`${command.name}\``)
                    .setDescription(command.description)
                    .addField("Usage", "`" + command.name + (command.args ? " " + command.args : "") + "`");

                message.channel.send({embeds: [embed]}).catch(console.error);
            } else {
                message.channel.send(`I don't know a command named "${tokens[0]}". Try running \`help\` without any parameters to see a list of commands.`).catch(console.error);
            }

        } else {
        
            const commands = [];
            for(const commandName in bot.commands) {
                const command = bot.getCommand(commandName, message.author, message.guild);
                if(command) {
                    commands.push(`\`${command.name}\`: ${command.description}`);
                }
            }

            message.channel.send(commands.join("\n") + "\nSpecify a command when running \`help\` for usage and specific info.").catch(console.error);
        
        }

        return true;

    }
};