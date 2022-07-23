// External dependencies
const {Client, Intents} = require("discord.js");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Local dependencies
const {CommandReader} = require("./command-reader.js");
const ServerData = require("./serverdata.js");
const Archive = require("./archive.js");
const {bot: config, database: dbConfig} = require("./config.json");

module.exports = class {

    constructor() {

        // Set up things that do not require Discord bot to be up
        const db = new Database(dbConfig.path);
        this.serverData = new ServerData(db);
        this.archive = new Archive();
        this.config = config; // for access in commands

        this.registerCommands();
        this.registerTriggers();

        // Start discord bot
        this.bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]}); // curse you, evil discord developers
        this.setupEventHandlers();
        this.bot.login(config.token);

    }

    registerCommands() {

        this.commands = {};
        this.commandsList = [];
        
        fs.readdir("./commands", (err, files) => {
            files.forEach(file => {
                const command = require(path.resolve("commands/" + file));
                this.commands[command.name] = command;
                if(command.aliases) {
                    for(const alias of command.aliases) this.commands[alias] = command;
                }
                this.commandsList.push(command);
            });
        });

    }

    async registerTriggers() {
    
        this.triggers = [];
    
        fs.readdir("./triggers", (err, files) => {

            files.forEach(file => {
                const trigger = require(path.resolve("triggers/" + file));
                this.triggers.push(trigger);
            });

            // sort triggers
            this.triggers.sort((a, b) => b.priority - a.priority);

        });

    }

    canRun(command, message) {

        // privileged commands skip the feature check
        if(command.privileged) {
            return config.superusers.includes(message.author.id);
        }

        // privileged users can use commands everywhere; otherwise, check if the feature is enabled in that server
        if(config.superusers.includes(message.author.id) || this.serverData.check(`command.${command.name}`, message)) {
            return true;
        }

        // deny access
        return false;

    }

    getCommand(commandName, message) {
        const command = this.commands[commandName];
        return command ? (this.canRun(command, message) && command) : null;
    }

    async handleCommand(message) {

        const reader = new CommandReader(message.content);
        const command = this.commands[reader.command];
        if(!command || !this.canRun(command, message)) {
            return;
        }

        try {
            await command.handle(this, message,reader);
        } catch(error) {
            if(error.syntaxError) {
                message.reply(error.message + `\nTry running \`$help ${command.name}\` for more usage info.`).catch(console.error);
            } else {    
                message.reply("An internal error occurred while handling the command. Please contact my owner. Run `$about` for more info.").catch(console.error);
                console.error(error);
            }
        }

    }

    handleTrigger(message) {

        for(const trigger of this.triggers) {
            if(this.serverData.check(`trigger.${trigger.name}`, message)) {
                if(Math.random() < (trigger.frequency ?? 1) && trigger.handle(this, message)) {
                    return;
                }
            }
        }

    }

    handleMessage(message) {
        
        const content = message.content;
        this.archive.archive(message);

        // Barrier: ignore bot messages
        if(message.author.bot) {
            return;
        }

        // Handle commands
        if(content[0] === config.cmdPrefix) {
            this.handleCommand(message);
            return;
        }

        this.handleTrigger(message);

    }

    setupEventHandlers() {
        this.bot.on("ready", () => console.log("Logged in as " + this.bot.user.tag));
        this.bot.on("messageCreate", (message) => this.handleMessage(message));
        this.bot.on("voiceStateUpdate", (oldState, newState) => this.handleVoiceEvent(oldState, newState));
    }

    // This returns an iterator, NOT an array!
    get guilds() {
        return this.bot.guilds.cache.values();
    }

    getGuild(id) {
        return this.bot.guilds.cache.get(id);
    }

};