const { formatDateShort } = require("../date");

module.exports = {
    name: "reminders",
    description: "List your reminders",
    handle: async (bot, message) => {

        const reminders = bot.reminders.getReminders(message.author.id);
        if(reminders.length == 0) {
            message.reply("You haven't set any reminders.").catch(console.error);
        } else {
            message.reply(reminders.map(reminder => `${reminder.ID}: ${reminder.description} (${formatDateShort(new Date(reminder.timestamp))})`).join("\n"));
        }

    }
};