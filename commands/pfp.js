const Discord = require("discord.js");

module.exports = {
    name: "pfp",
    args: "<user>",
    description: "Gets a user's profile picture",
    handle: (bot, message, reader) => {

        const user = bot.bot.users.cache.get(reader.readMention());
        if(user) {
            message.reply({files: [new Discord.MessageAttachment(user.avatarURL())]}).catch(console.error);
        } else {
            message.reply("I haven't seen that user, sorry :sob:").catch(console.error);
        }

    }
}