module.exports = {
    name: "clear",
    description: "Clear a reminder",
    handle: async (bot, message, reader) => {
        
        if(bot.reminders.removeReminder(message.author, reader.readToken())) {
            message.reply("Reminder cleared!").catch(console.error);
        } else {
            message.reply("There's no such reminder.").catch(console.error);
        }
    }
};