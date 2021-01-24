const Discord = require("discord.js");

module.exports = {
    name: "about",
    description: "Shows info about the bot",
    usage: "about",
    handle: async (bot, message) => {
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("About")
                .setDescription("I'm Drainbot, @drain#5012's custom discord bot. Try `$help` for a list of commands. If you're a coder, check out my code on [GitHub](https://github.com/adrian154/discord-bot).")
        ).catch(console.error);
    }
};