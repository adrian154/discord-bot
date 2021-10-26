const Discord = require("discord.js");

module.exports = {
    name: "setreminder",
    description: "Sets a reminder that the bot will ping you about later",
    handle: async (bot, message, reader) => {
        
        const timestamp = reader.readToken(), description = reader.readRest().join(" ");
        bot.reminders.addReminder(message.author, description, Date.now() + 3000);

    }
};