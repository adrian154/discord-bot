// External dependencies
const { Console } = require("console");
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

        // Barrier: ignore bot messages
        if(message.author.bot) {
            return;
        }

        if(content[0] === config.bot.cmdPrefix) {

            let tokens = content.split(" ");
            let commandName = tokens[0].substring(1);

            if(this.commands[commandName]) {
                this.commands[commandName].handle(this, message);
            } else {
                message.channel.send(`I don't know a command called "${commandName}". Do \`help\` for a list of commands.`);
            }

            return;

        }

        // Handle MC chat
        if(message.channel.name === config.bot["mc-channel-name"]) {
            this.mc.announceDiscordChat(message);
        }

    }

    setupEventHandlers() {

        this.bot.on("ready", () => {
            console.log(`Logged in as ${this.bot.user.tag}`);
            for(let guild of this.bot.guilds.cache.values()) {
                let channel = guild.channels.cache.find(channel => channel.name === config.bot["mc-channel-name"]);
                if(channel) this.mcChannels.set(guild, channel);
            }

        });

        this.bot.on("message", (message) => this.handleMessage(message));

    }

    mcBroadcast(message) {
        for(let channel of this.mcChannels.values()) {
            channel.send(message);
        }
    }

    handleMCInEvent(data) {
        
        let message;

        switch(data.type) {
            case "chat": message = `\`<${data.playerName}>\` ${data.message.replace(/`/g, "'")}`; break;
            case "death": message = `:skull_crossbones: \`${data.deathMessage}\``; break;
            case "join": message = `:inbox_tray: \`${data.playerName}\` joined.`; break;
            case "quit": message = `:outbox_tray: \`${data.playerName}\` left.`; break;
        }

        if(message) {
            this.mcBroadcast(message);
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
                this.handleMCInEvent(event.data);
                break;
            }
        }
    }

};