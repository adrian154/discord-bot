const { TextChannel } = require("discord.js");
const Database = require("better-sqlite3");

let archiving = false;
const limit = 100;

module.exports = {
    name: "archive",
    description: "Archive messages",
    privileged: true,
    handle: async (bot, message) => {

        if(archiving) {
            message.reply("Already archiving.").catch(console.error);
            return true;
        }

        archiving = true;
        message.reply("Beginning to archive.").catch(console.error);

        for(const channel of message.guild.channels.cache.values()) {
            if(channel instanceof TextChannel) {

                message.reply(`Now archiving ${channel.name}`);

                let previous;
                do {

                    const messages = await channel.messages.fetch({limit, before: previous});
                    for(const message of messages.values()) {
                        bot.archive.archive(message);
                    }
                    
                    if(messages.size < limit) break;
                    previous = messages.lastKey();

                
                } while(true);

            }
        }

        message.reply("Finished!");

    } 
};