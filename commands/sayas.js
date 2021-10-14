module.exports = {
    name: "sayas",
    description: "Sends a messge on your behalf",
    args: "<server ID> <channel ID> <message>",
    privileged: true,
    handle: (bot, message, reader) => {
        
        const guild = bot.getGuild(reader.readToken());
        if(!guild) {
            message.reply("Invalid server ID").catch(console.error);
            return;
        }

        const channel = guild.channels.cache.get(reader.readToken());
        if(!channel) {
            message.reply("Invalid channel ID").catch(console.error);
            return;
        }

        channel.send(reader.tokens.slice(reader.position, reader.tokens.length).join(" ")).catch(console.error);
        
    }
};