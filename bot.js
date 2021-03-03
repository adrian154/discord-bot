// External dependencies
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

// Local dependencies
const util = require("./util.js");
const config = require("./config.json").bot;

module.exports = class {

    constructor(mc, webend) {

        this.mc = mc;
        this.webend = webend;
        this.mcChannels = new Map();

        // init stuff
        this.initFeatures();
        this.mc.addEventRecipient(this);
        this.registerCommands();

        // Set up actual Discord bot
        this.bot = new Discord.Client();
        this.setupEventHandlers();
        this.bot.login(config.token);
        this.timeHandler();

    }

    initFeatures() {

        this.features = {};

        for(const server in config.features) {
            const properties = config.features[server];
            this.features[server] = {
                allow: properties.allow.map(util.wildcardToRegex),
                disallow: properties.disallow.map(util.wildcardToRegex)
            };
        }

        console.log(this.features);

    }

    timeHandler() {
        setInterval(() => {
            const date = new Date();
            if(date.getHours() === 16 && date.getMinutes() == 20) {
                // Something goes here... eventually
            }
        }, 1000);
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

    featureEnabled(featureName, server) {

        const properties = this.features[server.id] ?? this.features.default;

        // prefer: allowed
        for(const regex of properties.allow) {
            if(regex.exec(featureName)) {
                return true;
            }
        }

        // defer: disallow
        for(const regex of properties.disallow) {
            if(regex.exec(featureName)) {
                return false;
            }
        }

        // Default (shouldn't happen!)
        console.log(`WARNING: Feature "${featureName}" not covered by any allow or disallow rules for server "${server.name}" (${server.id})`);
        return false;

    }

    getCommand(name, sender, server) {
        
        let cmd = this.commands[name];
        if(cmd && (!cmd.privileged || sender && sender.id == config.owner) && this.featureEnabled("command:" + cmd.name, server)) {
            return cmd;
        }

    }

    handleCommand(message) {

        const tokens = message.content.split(" ");
        const commandName = tokens[0].substring(1);
        const cmd = this.getCommand(commandName, message.author, message.guild);
        
        if(cmd) {
            try {
                cmd.handle(this, message, tokens.slice(1, tokens.length));
            } catch(error) {
                message.channel.send("An internal error occurred while handling the command. Please contact the bot's maintainer. See `$about` for more info.").catch(console.error);
                console.error(error);
            }
        } else {
            message.channel.send(`I don't know a command called "${commandName}". Do \`help\` for a list of commands.`).catch(console.error);
        }

    }

    handleMessage(message) {
        
        const content = message.content;

        // Barrier: ignore bot messages
        if(message.author.bot) {
            return;
        }

        // Handle commands
        if(content[0] === config.cmdPrefix && this.featureEnabled("bot:commands", message.guild)) {
            this.handleCommand(message);
        }

        // Handle MC chat
        if(message.channel.name === config.MCChannelName && this.featureEnabled("mc:broadcast-discord", message.guild)) {
            this.mc.announceDiscordChat(message);
        }

    }

    setupEventHandlers() {

        this.bot.on("ready", () => {
            console.log(`Logged in as ${this.bot.user.tag}`);
            for(let guild of this.bot.guilds.cache.values()) {
                let channel = guild.channels.cache.find(channel => channel.name === config.MCChannelName);
                if(channel) this.mcChannels.set(guild, channel);
            }
        });

        this.bot.on("message", (message) => this.handleMessage(message));

    }

    mcBroadcast(message) {
        for(let channel of this.mcChannels.values()) {
            if(this.featureEnabled("mc:broadcast-mc", channel.guild)) {
                channel.send(message).catch(console.error);
            }
        }
    }

    handleMCInEvent(data) {
        
        let message;

        switch(data.type) {
            case "chat": message = `\`${data.playerName}: ${data.message.replace(/`/g, "'")}\``; break;
            case "death": message = `:skull_crossbones: \`${data.deathMessage.replace(/§./g, "")}\``; break;
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