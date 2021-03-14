module.exports = {
    name: "sayas",
    description: "Sends a messge on your behalf",
    privileged: true,
    handle: (bot, message, tokens) => {

        if(tokens.length < 3) return false;
        
        const guild = bot.getGuild(tokens[0]);
        if(!guild) {
            message.channel.send("Invalid server ID").catch(console.error);
            return;
        }

        const channel = guild.channels.cache.get(tokens[1]);
        if(!channel) {
            message.channel.send("Invalid channel ID").catch(console.error);
            return;
        }

        channel.send(tokens.slice(2, tokens.length).join(" ")).catch(console.error);
        return true;
        
    }
};