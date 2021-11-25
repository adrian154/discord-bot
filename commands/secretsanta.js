const {datafile, pick} = require("../util.js");
const participants = datafile("./data/secret-santa-data.json", []);
const fs = require("fs");

module.exports = {
    name: "secretsanta",
    privileged: true,
    description: "Does the Secret Santa rolling",
    handle: async (bot, message, reader) => {

        // fisher yates shuffle
        for(let i = participants.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = participants[j];
            participants[j] = participants[i];
            participants[i] = tmp;
        }

        for(let i = 0; i < participants.length; i++) {
            
            const gifter = participants[i];
            const recipient = participants[(i + 1) % participants.length];

            try {
                const user = await bot.bot.users.fetch(gifter.userID);
                user.send([
                    `Howdy, ${gifter.name}! Ready for Secret Santa 2021?`,
                    `This year, you'll be sending a gift to ||${recipient.name}||. Their address is ||${recipient.address}||.`,
                    `Cheers, DrainBot2000 :)`
                ].join("\n"));
            } catch(error) {
                console.error(error);
                message.reply(`FAILED TO SEND SECRET SANTA TO ${gifter.name}, ABORT!!!`).catch(console.error);
            }

        }

        fs.writeFileSync("data/secret-santa-pairings.txt", JSON.stringify(participants.map(x => x.name)));

    }
};