const Archive = require("../archive.js");

module.exports = {
    name: "archivestats",
    description: "Show archive statistics",
    privileged: true,
    handle: async (bot, message) => {
        const stats = Archive.getStats();
        message.reply(`I have archived ${stats.messages} messages from ${stats.users} users and ${stats.channels} channels`).catch(console.error);
    }
};