// External dependencies
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

// Local dependencies
const config = require("./config.json");

module.exports = class {

    constructor(mc) {

        // Set up misc. local state
        this.mc = mc;
        this.mc.addEventRecipient(this);
        this.mcChannels = new Map();
        this.registerCommands();

        // Set up Discord bot
        this.bot = new Discord.Client();
        this.setupEventHandlers();
        this.bot.login(config.bot.token);

    }

    registerCommands() {

        this.commands = {};

        fs.readdir("./commands", (err, files) => {
            files.forEach((file) => {
                let command = require(path.resolve("commands/" + file));
                this.commands[command.name] = command;
            });
        });      

    }

    handleMessage(message) {

        let content = message.content;

        if(content[0] === config.bot.cmdPrefix) {

            let tokens = content.split(" ");
            let commandName = tokens[0].substring(1);

            if(this.commands[commandName]) {
                this.commands[commandName].handle(this, message);
            } else {
                channel.send(`I don't know a command called "${commandName}". Do \`help\` for a list of commands.`);
            }

            return;

        }

    }

    setupEventHandlers() {

        this.bot.on("ready", () => {
            console.log(`Logged in as ${this.bot.user.tag}`);
        });

        this.bot.on("message", (message) => this.handleMessage(message));

        for(let guild of this.bot.guilds.cache) {
            let channel = guild.channels.cache.find(channel => channel.name === config.bot["mc-channel-name"]);
            if(channel) this.mcChannels.set(guild, channel);
        }

    }

    mcBroadcast(message) {
        for(let channel of this.mcChannels.keys()) {
            channel.send(message);
        }
    }

    handleMCEvent(event) {
        switch(event.type) {
            case "connected": {
                this.mcBroadcast(":white_check_mark: Connected to Minecraft server");
                break;
            }
            case "connectionLost": {
                this.mcBroadcast(":x: Lost connection to Minecraft server");
                break;
            }
            case "incomingMessage": {
                break;
            }
        }
    }

};