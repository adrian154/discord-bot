const {CommandSyntaxError} = require("../command-reader");

const format = features => "```" + features.map(feature => `${feature.feature}: ${feature.value ? "enabled" : "disabled"}`).join("\n") + "```";

module.exports = {
    name: "feature",
    aliases: ["f"],
    args: "enable|disable|check <feature> [server ID] OR list [serverid]",
    privileged: true,
    handle: (bot, message, reader) => {

        let feature, serverID;
        const subcommand = reader.readToken();
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
            bot.serverData.setFeature(serverID, feature, 1);
            message.channel.send(`Enabled feature \`${feature}\``);
        } else if(subcommand === "disable") {
            bot.serverData.setFeature(serverID, feature, 0);
            message.channel.send(`Disabled feature \`${feature}\``);
        } else if(subcommand === "check") {
            message.channel.send(`Feature \`${feature}\` is \`${bot.serverData.checkFeature(serverID, feature) ? "ENABLED" : "DISABLED"}\``);
        } else {
            throw new CommandSyntaxError("Unknonwn subcommand");
        }

    }
};