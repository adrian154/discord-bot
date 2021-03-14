const vowel = char => "aeiou".includes(char?.toLowerCase());
const consonant = char => "bcdfghjklmnpqrstvwxyz".includes(char?.toLowerCase());
const piglatin = word => vowel(word[0]) ? word + "way" :
                         consonant(word[1]) ? word.slice(2, word.length) + word.slice(0, 2) + "ay" :
                         vowel(word[1]) ? word.slice(1, word.length) + (word[0] ?? "") + "ay" :
                         word;

module.exports = {
    name: "piglatin",
    frequency: 0.1,
    handle: (bot, message) => {
        message.channel.send(message.content.split(/\s+/g).map(piglatin).join(" ")).catch(console.error);
        return true;
    }
};