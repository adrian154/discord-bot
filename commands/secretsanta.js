const {datafile, pick} = require("../util.js");
const participants = datafile("./data/secret-santa-data.json", []);
const fs = require("fs");

module.exports = {
    name: "secretsanta",
    privileged: true,
    description: "Does the Secret Santa rolling",
    handle: async (bot, message, reader) => {

        const copy = participants.slice();
    
        for(const gifter of participants) {
            gifter.person = pick(participants.filter(person => person !== gifter));
            copy.splice(participants.indexOf(gifter.person), 1);
        }

        fs.writeFileSync("data/secret-santa-pairings.txt", participants.map(gifter => `${gifter.name} -> ${gifter.person.name}`).join("\n"));

        for(const gifter of participants) {
            bot.bot.users.fetch(gifter.userID).then(user => user.send([
                `Howdy, ${gifter.name}! Ready for Secret Santa 2021?`,
                `This year, you'll be sending a gift to ||${gifter.person.name}||. Their address is ||${gifter.person.address}||.`,
                `**REMEMBER**: Don't tell *anyone* who your assigned person is!`,
                `Cheers, drainbot2000 :heart:`
            ].join("\n")).catch(error => console.log(`FAILED TO SEND SECRET SANTA TO ${gifter.name}: ${error}`)));
        }

    }
};