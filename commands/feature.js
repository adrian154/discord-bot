const {CommandSyntaxError} = require("../command-reader");

const format = features => "```" + features.map(feature => `${feature.feature}: ${feature.value ? "enabled" : "disabled"}`) + "```";

module.exports = {
    name: "feature",
    args: "enable|disable|check <feature> [server ID] OR list [serverid]",
    privileged: true,
    handle: (bot, message, reader) => {

        let feature, serverID;
        if(subcommand !== "list") {
            feature = reader.readToken();
        }

        serverID = reader.readToken(message.guild.id);

        if(subcommand === "list") {
            message.reply(format(bot.serverData.getFeatures(serverID))).catch(console.error);
        } else if(subcommand === "reset") {
            bot.serverData.reset(reader.readToken(serverID));
            message.reply(`Completely reset permissions for that server.`).catch(console.error);
        } else if(subcommand === "enable") {
            bot.serverData.setFeature(serverID, feature, true);
            message.channel.send(`Enabled feature \`${feature}\``);
        } else if(subcommand === "disable") {
            bot.serverData.setFeature(serverID, feature, false);
            message.channel.send(`Disabled feature \`${feature}\``);
        } else if(subcommand === "check") {
            message.channel.send(`Feature \`${feature}\` is \`${bot.serverData.checkFeature(server, feature) ? "ENABLED" : "DISABLED"}\``);
        } else {
            throw new CommandSyntaxError("Unknonwn subcommand");
        }

    }
};