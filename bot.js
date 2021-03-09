// External dependencies
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

// Local dependencies
const MC = require("./mc.js");
const ServerData = require("./serverdata.js");
const Webend = require("./webend.js");

const util = require("./util.js");
const config = require("./config.json").bot;

module.exports = class {

    constructor() {

        // init stuff
        this.initFeatures();
        this.registerCommands();

        // Set up actual Discord bot
        this.bot = new Discord.Client();
        this.setupEventHandlers();
        this.bot.login(config.token);

    }

    // events passthrough
    on(event, handler) {
        this.bot.on(event, handler);
    }

    // This returns an interator, NOT an array!
    // They are deceptively similar.
    get guilds() {
        return this.bot.guilds.cache.values();
    }

    // Initialization after Discord is ready
    initClient() {
        console.log(`Logged in as ${this.bot.user.tag}`);
        this.serverData = new ServerData(this);
        this.mc = new MC(this);
        this.webend = new Webend();
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

    }

    registerCommands() {

        this.commands = {};

        fs.readdir("./commands", (err, files) => {
            files.forEach(file => {
                const command = require(path.resolve("commands/" + file));
                this.commands[command.name] = command;
            });
        });      

    }

    featureEnabled(featureName, server) {

        const properties = this.features[server.id] ?? this.features.default;

        // disallow rules take precedence over allow rules
        for(const regex of properties.disallow) {
            if(regex.exec(featureName)) {
                return false;
            }
        }

        for(const regex of properties.allow) {
            if(regex.exec(featureName)) {
                return true;
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
        this.bot.on("ready", () => this.initClient());
        this.bot.on("message", (message) => this.handleMessage(message));
    }

};