const datafile = require("../datafile.js");
const util = require("../util.js");
const words = datafile("./data/poetry-words.json");

const generateLine = (maxSyllables) => {
    
    let totSyllables = 0;
    const line = [];

    while(totSyllables < maxSyllables) {
        const syllables = Math.floor(Math.random() * Math.min(words.length, maxSyllables - totSyllables)) + 1;
        line.push(util.pick(words[syllables - 1]));
        totSyllables += syllables;
    }

    return line.join(" ");

};

const generateHaiku = () => generateLine(5) + "\n" + generateLine(7) + "\n" + generateLine(5);

module.exports = {
    name: "haiku",
    description: "Generates a haiku",
    handle: (bot, message) => {
        message.channel.send(generateHaiku()).catch(console.error);
        return true;
    }
};