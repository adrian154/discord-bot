module.exports = {
    name: "setmcchannel",
    description: "Sets the Minecraft channel for the server",
    usage: "setmcchannel <channel>",
    privileged: true,
    handle: (bot, message, tokens) => {
        
        if(tokens.length != 1) {
            message.channel.send("Incorrect usage.").catch(console.error);
            return;
        }

        const channelMention = tokens[0].match(/<#(\d+)>/);
        if(!channelMention[1]) {
            message.channel.send("Incorrect usage.").catch(console.error);
            return;
        }

        const channelID = channelMention[1];
        const channel = message.guild.channels.cache.get(channelID);
        if(channel) {
            message.channel.send("Set the Minecraft channel for this server to " + channel.name);
            bot.serverData.setMCChannel(message.guild, channel);
        } else {
            message.channel.send("Invalid channel.").catch(console.error);
        }

    }
};