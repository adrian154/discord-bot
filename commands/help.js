const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Provides helpful advice",
    args: "[command]",
    handle: (bot, message, reader) => {

        const commandName = reader.peek();
        if(commandName) {
            
            const command = bot.getCommand(commandName, message.author, message.guild);
            if(command) {

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Help for \`${command.name}\``)
                    .setDescription(command.description)
                    .addField("Usage", "`" + command.name + (command.args ? " " + command.args : "") + "`");

                if(command.aliases) embed.addField("Aliases", command.aliases.join(", "), true);
                message.reply({embeds: [embed]}).catch(console.error);

            } else {
                message.reply(`I don't know a command named "${commandName}". Try running \`help\` without any parameters to see a list of commands.`).catch(console.error);
            }

        } else {
            const commands = bot.commandsList.filter(command => bot.canRun(command, message.author, message.guild)).map(command => `\`${command.name}\`: ${command.description}`);
            message.reply(commands.join("\n") + "\nSpecify a command when running \`help\` for usage and specific info.").catch(console.error);
        }

    }
};