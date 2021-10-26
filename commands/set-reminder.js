const {CommandSyntaxError} = require("../command-reader");
const {DAY, HOUR, MINUTE, SECOND, formatDateFull} = require("../date.js");

module.exports = {
    name: "reminder",
    description: "Sets a reminder that the bot will ping you about later",
    args: "in *d*h*m*s (* = days/hours/minutes/seconds)",
    handle: async (bot, message, reader) => {
        
        const tok = reader.readToken();
        let timestamp;
        if(tok === "in") {

            const diff = reader.readToken();
            const parsed = diff.match(/(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/); // a write-only  masterpiece

            timestamp = Date.now() + (Number(parsed[1]) || 0) * DAY + 
                                     (Number(parsed[2]) || 0) * HOUR +
                                     (Number(parsed[3]) || 0) * MINUTE + 
                                     (Number(parsed[4]) || 0) * SECOND 

        } else if(tok === "at") {

            // todo

        } else {
            throw new CommandSyntaxError("Invalid time!");
        }

        if(timestamp - Date.now() < 1000) {
            message.reply("That's too soon.").catch(console.error);
        } else {
            
            const description = reader.readRest().join(" ");
            bot.reminders.addReminder(message.author, description, timestamp);
            message.reply(`I'll remind you on ${formatDateFull(new Date(timestamp))}`).catch(console.error);
        
        }

    }
};