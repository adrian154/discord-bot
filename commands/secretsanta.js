// External dependencies
const Discord = require("discord.js");

// Local dependencies
const data = require("../data/secret-santa-data.json");

module.exports = {
    name: "ss",
    hidden: true,
    description: "Does the Secret Santa rolling",
    handle: async (bot, message) => {

        for(let i = data.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = data[i];
            data[i] = data[j];
            data[j] = tmp;
        }

        let members = await message.guild.members.fetch();

        for(let i = 0; i < data.length; i++) {

            let senderUser = members.get(data[i].id);
            let recipient = data[(i + 1) % data.length];

            try {
                senderUser.send([
                    `Howdy, ${data[i].name}!`,
                    `You'll be sending your present to ||${recipient.name}||. Their address is ||${recipient.address[0] + ", " + recipient.address[1]}||.`,
                    `**REMEMBER**: Don't tell anyone who your assigned person is!`,
                    `Cheers, Drainbot2000`
                ].join("\n"));
            } catch(exception) {
                console.log(exception);
            }

        }

    }
}