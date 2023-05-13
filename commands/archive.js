const { TextChannel } = require("discord.js");
const Archive = require("../archive.js");

let archiving = false;
const limit = 100;

module.exports = {
    name: "archive",
    description: "Archive messages",
    privileged: true,
    handle: async (bot, message) => {

        if(archiving) {
            message.reply("Already archiving.").catch(console.error);
            return;
        }

        archiving = true;
        message.reply("Beginning to archive.").catch(console.error);

        for(const channel of message.guild.channels.cache.values()) {
            if(channel instanceof TextChannel) {

                message.reply(`Now archiving ${channel.name}`);

                try {
                    let previous;
                    do {

                        const messages = await channel.messages.fetch({limit, before: previous});

                        Archive.beginTransaction();
                        for(const message of messages.values()) {
                            Archive.archive(message, true);
                        }
                        Archive.commit();
                        
                        if(messages.size < limit) break;
                        previous = messages.lastKey();

                    
                    } while(true);
                } catch(err) {
                    console.error(err);
                    message.reply("Error occurred while archiving that channel, proceeding to next.");
                }

            }
        }

        message.reply("Finished!");

    } 
};