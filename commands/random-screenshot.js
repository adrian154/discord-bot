module.exports = {
    name: "rss",
    description: "See a random screenshot uploaded from LightShot",
    handle: (bot, message) => {
        message.channel.send(`https://prnt.sc/${Math.floor(Math.random() * 2981820662).toString(36)}`);
        return true;
    }
};