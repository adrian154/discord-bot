// External dependencies
const Discord = require("discord.js");
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Local dependencies
const ServerData = require("./serverdata.js");
const UserData = require("./userdata.js");
const Webend = require("./webend.js");
const {bot: config, database: dbConfig} = require("./config.json");

module.exports = class {

    constructor() {

        // Set up things that do not require Discord bot to be up
        const db = new Database(dbConfig.path);
        this.serverData = new ServerData(db);
        this.userData = new UserData(db);
        this.drainCoin = require("./draincoin.js");

        this.webend = new Webend();
        this.registerCommands();
        this.registerTriggers();

        // Start discord bot
        this.bot = new Discord.Client();
        this.setupEventHandlers();
        this.bot.login(config.token);

    }

    // Allow foreign objects to attach event handlers
    on(event, handler) {
        this.bot.on(event, handler);
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

    getCommand(name, sender, server) {
        const cmd = this.commands[name];
        if(cmd && (!cmd.privileged || sender && sender.id == config.owner) && this.serverData.getServer(server).isEnabled("command." + cmd.name)) {
            return cmd;
        }
    }

    async handleCommand(message) {

        const tokens = message.content.trim().split(/\s+/);
        const commandName = tokens[0].substring(1);
        const command = this.getCommand(commandName, message.author, message.guild);

        if(!command) {
            message.channel.send(`I don't know a command called "${commandName}". Do \`help\` for a list of commands.`).catch(console.error);
            return;
        }

        try {
            if(!await command.handle(this, message, tokens.slice(1, tokens.length))) {
                message.channel.send(`Incorrect usage. Try \`$help ${command.name}\` for more information on how to use that command.`);
            }
        } catch(error) {
            message.channel.send("An internal error occurred while handling the command. Please contact my owner. Do `$about` for more info.").catch(console.error);
            console.error(error);
        }

    }

    handleTrigger(message) {

        const server = this.serverData.getServer(message.guild);

        for(const trigger of this.triggers) {
            if(server.isEnabled("trigger." + trigger.name)) {
                if(Math.random() < (trigger.frequency ?? 1) && trigger.handle(this, message)) {
                    return;
                }
            }
        }

    }

    handleMessage(message) {
        
        const content = message.content;

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

    handleVoiceEvent(oldState, newState) {

        const server = this.serverData.getServer(oldState.guild);
        if(!server.isEnabled("trigger.voicelogs")) {
            return;
        }

        const logChannelID = server.voiceLogsChannel;
        if(!logChannelID) {
            return;
        }

        const logChannel = oldState.guild.channels.cache.get(logChannelID);
        if(!logChannel) {
            return;
        }

        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const user = (oldState.member || newState.member).user.tag;

        if(oldChannel === newChannel) return;

        if(oldChannel) {
            if(!newChannel) {
                logChannel.send(`:outbox_tray: \`${user}\` left \`${oldChannel.name}\``).catch(console.error); 
            } else {
                logChannel.send(`:twisted_rightwards_arrows: \`${user}\` moved from \`${oldChannel.name}\` to \`${newChannel.name}\``);
            }
        } else if(newChannel) {
            logChannel.send(`:inbox_tray: \`${user}\` joined \`${newChannel.name}\``).catch(console.error);
        }

    }

    setupEventHandlers() {
        this.bot.on("message", (message) => this.handleMessage(message));
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