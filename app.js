const config = require("./config.json");
process.env.TZ = config.timezone;

console.log("Starting app...");
const Bot = require("./bot.js");
const bot = new Bot();