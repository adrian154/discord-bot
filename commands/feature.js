const format = features => "```" + features.map(feature => `${feature.feature}: ${feature.value ? "enabled" : "disabled"}`) + "```";

module.exports = {
    name: "feature",
    args: "enable|disable|check <feature> [server ID] OR list [serverid]",
    privileged: true,
    handle: (bot, message, tokens) => {
        
        const subcommand = tokens[0];
        const feature = tokens[1];
        const serverID = subcommand === "list" ? tokens[1] : tokens[2];

        if(subcommand === "list") {
            message.reply(format(bot.serverData.getFeatures(serverID))).catch(console.error);
        } else if(subcommand === "reset") {
            bot.serverData.reset(serverID);
            message.reply(`Completely reset permissions for that server.`).catch(console.error);
        } else if(subcommand === "enable") {
            bot.serverData.setFeature(serverID, feature, true);
            message.channel.send(`Enabled feature \`${feature}\``);
        } else if(subcommand === "disable") {
            bot.serverData.setFeature(serverID, feature, false);
            message.channel.send(`Disabled feature \`${feature}\``);
        } else if(subcommand === "check") {
            message.channel.send(`Feature \`${feature}\` is \`${bot.serverData.checkFeature(feature) ? "ENABLED" : "DISABLED"}\``);
        } else {
            return false;
        }

        return true;

    }
};