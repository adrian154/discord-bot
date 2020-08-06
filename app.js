const Discord = require("discord.js");
const bot = new Discord.Client();
const token = require("./token.js");

bot.on("ready", () => {
    console.log(`logged in as ${bot.user.tag}`);
});

bot.on("message", (message) => {

});

bot.login(token);