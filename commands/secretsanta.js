const {datafile} = require("../util.js");
const participants = datafile("./data/secret-santa-data.json", []);
const fs = require("fs");

module.exports = {
    name: "secretsanta",
    privileged: true,
    description: "Does the Secret Santa rolling",
    handle: async (bot, message, reader) => {

        // shuffle participants
        const shuffled = participants.map(person => [person, Math.random()])
                                     .sort((a, b) => a[1] - b[1])
                                     .map(pair => pair[0]);

        for(let i = 0; i < shuffled.length; i++) {
            
            const gifter = shuffled[i];
            const recipient = shuffled[(i + 1) % shuffled.length];

            try {
                console.log(gifter.name, recipient.name);
                const user = await bot.bot.users.fetch(gifter.userID);
                await user.send([
                    `Howdy, ${gifter.name}! Ready for Secret Santa 2022?`,
                    `This year, you'll be sending a gift to ||${recipient.name}||. Their address is ||${recipient.address}||.`,
                    `Cheers, DrainBot2000 :)`
                ].join("\n"));
            } catch(error) {
                console.error(error);
                message.reply(`!!! FAILED TO SEND SECRET SANTA MESSAGE TO ${gifter.name}, ABORT !!!`).catch(console.error);
            }

        }

        // save participants to a file
        fs.writeFileSync("data/secret-santa-pairings-2022.txt", JSON.stringify(shuffled.map(x => x.name)));

    }
};