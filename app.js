// local deps
const Bot = require("./bot.js");
const MC = require("./mc.js");
const Webend = require("./webend.js");

console.log("Starting app...");

const mc = new MC();
const webend = new Webend();
const bot = new Bot(mc, webend);