const config = require("../config.json").serverdb;

const format = (rules, depth) => {

    if(typeof rules === "boolean") {
        return String(rules);
    }

    // Check if the node is terminal.
    if(Object.keys(rules).length == 1 && "default" in rules) {
        return String(rules.default);
    }

    let result = [];

    // Other crap
    for(const key in rules) {
        result.push(`${"\t".repeat(depth)}${key}: ${format(rules[key], depth + 1)}`);
    }
    
    return "\n" + result.join("\n");

};

module.exports = {
    name: "feature",
    args: "<enable|disable|check> <feature name> [server ID] OR <list> server [server ID]",
    privileged: true,
    handle: (bot, message, tokens) => {
        
        const subcommand = tokens[0];
        const feature = tokens[1];
        const server = bot.serverData.getServer({id: tokens[2] ?? message.guild?.id});

        if(subcommand === "list") {
            message.channel.send("```" + format(server.rules, 0) + "```");
        } else if(subcommand === "reset") {
            server.rules = config.defaultPermissions;
            server.saveRules();
            message.channel.send(`Completely reset permissions.`);
        } else if(subcommand === "enable") {
            server.setRule(feature, true);
            message.channel.send(`Enabled feature \`${feature}\``);
        } else if(subcommand === "disable") {
            server.setRule(feature, false);
            message.channel.send(`Disabled feature \`${feature}\``);
        } else if(subcommand === "check") {
            message.channel.send(`Feature \`${feature}\` is \`${server.isEnabled(feature) ? "ENABLED" : "DISABLED"}\``);
        } else {
            return false;
        }

        return true;

    }
};