module.exports = {
    name: "bindchannel",
    description: "Binds a specific channel",
    args: "<channel> <mc|voicelogs>",
    privileged: true,
    handle: (bot, message, tokens) => {
        
        if(tokens.length != 2) {
            return false;
        }

        const channelMention = tokens[0].match(/<#(\d+)>/);
        if(!channelMention[1]) {
            return false;
        }

        const channelID = channelMention[1];
        const channel = message.guild.channels.cache.get(channelID);
        const server = bot.serverData.getServer(message.guild);
        const type = tokens[1];

        if(type === "mc") {
            server.MCChannel = channel;
            channel.send("This channel is now the Minecraft channel.").catch(console.error);
        } else if(type === "voicelogs") {
            server.voiceLogsChannel = channel;
            channel.send("This channel is now the voice logs channel.").catch(console.error);
        } else {
            return false;
        }

        return true;

    }
};