const Discord = require("discord.js");

module.exports = {
    name: "pfp",
    args: "<user>",
    description: "Gets a user's profile picture",
    handle: (bot, message) => {

        try {
            let user = message.mentions.users.first(1)[0];
            message.channel.send(new Discord.MessageAttachment(user.avatarURL())).catch(console.error);
        } catch(err) {
            return false;
        }

        return true;

    }
}