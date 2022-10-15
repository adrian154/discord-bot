const { CommandSyntaxError } = require("../command-reader");
const Rules = require("../rules.js");

module.exports = {
    name: "rules",
    description: "Manage rules",
    args: "enable|disable <key> <scope type> [scope] OR list [keys]",
    privileged: true,
    handle: (bot, message, reader) => {

        const subcommand = reader.readToken();
        if(subcommand === "enable" || subcommand === "disable" || subcommand === "delete") {

            const key = reader.readToken(), scopeType = reader.readToken();
            let scopeId = "";

            if(scopeType === "user") {
                if(reader.hasRemaining()) {
                    scopeId = reader.readToken();
                } else {
                    scopeId = message.author.id;
                }
            } else if(scopeType === "channel") {
                if(reader.hasRemaining()) {
                    scopeId = reader.readToken();
                } else {
                    scopeId = message.channel.id;
                }
            } else if(scopeType === "guild") {
                if(reader.hasRemaining()) {
                    scopeId = reader.readToken();
                } else if(message.guild) {
                    scopeId = message.guild.id;
                } else {
                    throw new CommandSyntaxError(`Not in a guild right now!`);
                }
            } else if(scopeType === "global") {
                scopeId = "global";
            } else {
                throw new CommandSyntaxError(`Invalid scope type "${scopeType}"`);
            }

            if(subcommand === "delete") {
                Rules.deleteRule(scopeId, key);
            } else {
                Rules.addRule({
                    scopeType,
                    scopeId,
                    key,
                    value: subcommand === "enable" ? 1 : 0
                });
            }

            message.reply(`Rule successfully updated!`).catch(console.error);

        } else if(subcommand === "list") {

            const keys = reader.readRest();
            let rules = Rules.getRules();
            
            if(keys.length > 0) {
                rules = rules.filter(rule => keys.includes(rule.key)); 
            }

            if(rules.length == 0) {
                message.reply("No results available.").catch(console.error);
                return;
            }

            // group by key
            const groups = {};
            for(const rule of rules) {
                if(!groups[rule.key]) {
                    groups[rule.key] = [];
                }
                groups[rule.key].push(rule);
            }

            // print
            message.reply(Object.keys(groups).map(key => `${key}:\n` + groups[key].map(rule => ` - ${rule.scopeType} ${rule.scopeId}: ${rule.value ? "ENABLED" : "DISABLED"}`).join('\n')).join('\n\n')).catch(console.error);

        } else {
            throw new CommandSyntaxError("Unknown subcommand");
        }

    }
};