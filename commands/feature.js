const {CommandSyntaxError} = require("../command-reader");

const format = features => "```" + features.map(feature => `${feature.feature}: ${feature.value ? "enabled" : "disabled"}`).join("\n") + "```";

const readDomain = (reader, message) => {
    const token = reader.readToken(message.guild?.id || "default");
    if(token === "@USER") return reader.readMention();
    if(token === "#CHANNEL") return reader.readChannelMention();
    return token;
};

module.exports = {
    name: "feature",
    aliases: ["f"],
    description: "Manage features",
    args: "enable|disable|resetAll|reset <feature> [domain] OR list [domain]",
    privileged: true,
    handle: (bot, message, reader) => {

        const subcommand = reader.readToken();
        
        if(subcommand === "list") {

            // list [domain]
            const features = bot.serverData.getFeatures(readDomain(reader, message)), domain = readDomain(reader, message);
            message.reply(features.length > 0 ? format(features) : `Domain ${domain} has no feature rules`).catch(console.error);
        
        } else if(subcommand === "reset") {
        
            // reset [feature] [domain]
            const feature = reader.readToken(), domain = readDomain(reader, message);
            bot.serverData.reset(feature, domain);
            message.reply(`Removed feature rule \`${feature}\` for domain ${domain}`);
        
        } else if(subcommand === "resetall") {
        
            // reset [domain]
            const domain = readDomain(reader, message);
            bot.serverData.resetAll(domain);
            message.reply(`Completely reset permissions for domain ${domain}`).catch(console.error);
        
        } else if(subcommand === "enable") {

            // enable [feature] [domain]
            const feature = reader.readToken(), domain = readDomain(reader, message);
            bot.serverData.setFeature(domain, feature, 1);
            message.channel.send(`Enabled feature \`${feature}\` for domain ${domain}`);
        
        } else if(subcommand === "disable") {

            // disable [feature] [domain] 
            const feature = reader.readToken(), domain = readDomain(reader, message);
            bot.serverData.setFeature(domain, feature, 0);
            message.channel.send(`Disabled feature \`${feature}\` for domain ${domain}`);
        
        } else {
            throw new CommandSyntaxError("Unknown subcommand");
        }

    }
};