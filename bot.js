// External dependencies
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

// Local dependencies
const MC = require("./mc.js");
const ServerData = require("./serverdata.js");
const Webend = require("./webend.js");

const util = require("./datafile.js");
const config = require("./config.json").bot;

module.exports = class {

    constructor() {

        // Set up things that do not require Discord bot to be up
        this.serverData = new ServerData(this);
        this.webend = new Webend();
        this.registerCommands();

        // Start discord bot
        this.bot = new Discord.Client();
        this.setupEventHandlers();
        this.bot.login(config.token);

    }

    // Allow foreign objects to attach event handlers
    on(event, handler) {
        this.bot.on(event, handler);
    }

    // This returns an interator NOT an array
    // They are deceptively similar, but beware:
    // It'll seduce you like a siren calling out to a sailor at sea. Tread with caution.
    get guilds() {
        return this.bot.guilds.cache.values();
    }

    // Initialization after Discord is ready
    initClient() {
        console.log(`Logged in as ${this.bot.user.tag}`);
        this.mc = new MC(this);
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

    getCommand(name, sender, server) {
        
        let cmd = this.commands[name];
        if(cmd && (!cmd.privileged || sender && sender.id == config.owner) && this.serverData.getServer(server).isEnabled("command." + cmd.name)) {
            return cmd;
        }

    }

    async handleCommand(message) {

        const tokens = message.content.trim().split(/\s/);
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

    handleMessage(message) {
        
        const content = message.content;
        const server = this.serverData.getServer(message.guild);

        // Barrier: ignore bot messages
        if(message.author.bot) {
            return;
        }

        // Handle commands
        if(content[0] === config.cmdPrefix) {
            this.handleCommand(message);
            return;
        }

        // other message triggers
        if(message.content.indexOf(":rofl:") >= 0 && server.isEnabled("trigger.rofl")) {
            message.channel.send("EAT SHIT AND DIE").catch(console.error);
            return;
        }

    }

    setupEventHandlers() {
        this.bot.on("ready", () => this.initClient());
        this.bot.on("message", (message) => this.handleMessage(message));
    }

};