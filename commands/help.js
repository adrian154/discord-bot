const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Provides helpful advice",
    usage: "help [command]",
    handle: (bot, message) => {

        let tokens = message.content.split(" ");
        if(tokens.length >= 2) {
            let command = bot.commands[tokens[1]];
            if(command) {
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle(`Help for \`${command.name}\``)
                        .setDescription(command.description)
                        .addField("Usage", "`" + command.usage + "`")
                );
            } else {
                message.channel.send(`I don't know a command named "${tokens[1]}". Try running \`help\` without any parameters to see a list of commands.`);
            }
        } else {
            message.channel.send(Object.values(bot.commands).map(command => `\`${command.name}\`: ${command.description}`).join("\n") + "\nSpecify a command when running \`help\` for usage and specific info.");
        }

    }
};