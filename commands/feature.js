const {CommandSyntaxError} = require("../command-reader");

const format = features => "```" + features.map(feature => `${feature.feature}: ${feature.value ? "enabled" : "disabled"}`).join("\n") + "```";

module.exports = {
    name: "feature",
    aliases: ["f"],
    args: "enable|disable|check <feature> [domain] OR list [domain]",
    privileged: true,
    handle: (bot, message, reader) => {

        let feature, domain;
        const subcommand = reader.readToken();
        if(subcommand !== "list") {
            feature = reader.readToken();
        }

        domain = reader.readToken(message.guild.id);

        if(subcommand === "list") {
            message.reply(format(bot.serverData.getFeatures(domain))).catch(console.error);
        } else if(subcommand === "reset") {
            bot.serverData.reset(domain, feature);
            message.reply(`Removed feature rule \`${feature}\``);
        } else if(subcommand === "resetAll") {
            bot.serverData.reset(domain);
            message.reply(`Completely reset permissions for that server.`).catch(console.error);
        } else if(subcommand === "enable") {
            bot.serverData.setFeature(domain, feature, 1);
            message.channel.send(`Enabled feature \`${feature}\``);
        } else if(subcommand === "disable") {
            bot.serverData.setFeature(domain, feature, 0);
            message.channel.send(`Disabled feature \`${feature}\``);
        } else if(subcommand === "check") {
            message.channel.send(`Feature \`${feature}\` is \`${bot.serverData.checkFeature(domain, feature) ? "ENABLED" : "DISABLED"}\``);
        } else {
            throw new CommandSyntaxError("Unknown subcommand");
        }

    }
};