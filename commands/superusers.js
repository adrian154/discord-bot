const { CommandSyntaxError } = require("../command-reader");

module.exports = {
    name: "superusers",
    aliases: ["su"],
    description: "Allows temporary addition or removal of superusers",
    args: "add|remove <user> | list",
    privileged: true,
    handle: (bot, message, reader) => {

        const token = reader.readToken();
        if(token === "list") {
            message.reply("Superusers: " + bot.config.superusers.join(",")).catch(console.error);
        } else if(token === "add") {
            bot.config.superusers.push(reader.readMention());
        } else if(token === "remove") {
            bot.config.superusers = bot.config.superusers.filter(x => x !== reader.readMention());
        } else {
            throw new CommandSyntaxError("Unknown subcommand");
        }
        
    }
};