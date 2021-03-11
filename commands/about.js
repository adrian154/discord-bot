const Discord = require("discord.js");

module.exports = {
    name: "about",
    description: "Shows info about the bot",
    handle: async (bot, message) => {
        
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("About")
                .setDescription("I'm Drainbot2000, a custom bot with a bunch of random features.\nIf I am going haywire, contact my creator.")
                .addField("Creator", "`drain#5012`")
                .addField("GitHub Repository", "[Here](https://github.com/adrian154/discord-bot)")
        ).catch(console.error);
        
        return true;

    }
};