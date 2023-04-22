const {datafile} = require("../util.js");
const participants = datafile("./data/secret-santa-data.json", []);

module.exports = {
    name: "secretsanta-test",
    privileged: true,
    description: "Tests the Secret Santa system",
    handle: async (bot, message, reader) => {

        for(const participant of participants) {
            console.log("Sending message to " + participant.name);
            const user = await bot.bot.users.fetch(participant.userID);
            user.send([
                "You are receiving this message because you are listed as participating in Secret Santa 2022.",
                `Your address is listed as: ${participant.address}. Please contact Adrian if this is not correct.`,
                "No further action is necessary at this time."
            ].join("\n")).catch(err => {
                console.error(err);
                message.reply(`WARNING: FAILED TO SEND MESSAGE TO ${participant.name} (${participant.userID})`);
            });
        }

    }
};