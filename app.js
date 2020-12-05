const Bot = require("./bot.js");
const MC = require("./mc.js");

console.log("Starting app...");

const mc = new MC();
const bot = new Bot(mc);