// External dependencies
const {CommandReader} = require("./command-reader.js");
const {Client, GatewayIntentBits} = require("discord.js");
const Archive = require("./archive.js");
const Rules = require("./rules.js");
const path = require("path");
const fs = require("fs");

const config = require("./config.json");

// read last online
let lastOnline;
if(fs.existsSync("data/last-online")) {
    lastOnline = fs.readFileSync("data/last-online", "utf-8");
}

class Bot {

    constructor() {

        this.rules = Rules;

        this.registerCommands();
        this.registerTriggers();

        // Start discord bot
        this.bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages]}); // curse you, evil discord developers
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

        // only superusers can run privileged commands
        if(command.privileged) {
            return config.superusers.includes(message.author.id);
        }

        // superusers can use commands everywhere
        if(config.superusers.includes(message.author.id)) { 
            return true;
        }

        // check if there's a specific rule about the command
        return Rules.getForMessage(`commands.${command.name}`, "commands", message);

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

            if(Rules.getForMessage(`trigger.${trigger.name}`, "triggers", message)) {
                if(Math.random() < trigger.frequency && trigger.handle(this, message)) {
                    return;
                }
            }
        }

    }

    handleMessage(message) {
        
        const content = message.content;
        Archive.archive(message);

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
        this.bot.on("ready", () => {
            console.log("Logged in as " + this.bot.user.tag)
            this.bot.channels.fetch(config.wakeupChannel).then(channel => channel.send(`<@${config.owner}> I'm back! (Last online time: ${lastOnline || "unknown"})`)).catch(console.error);
        });
        this.bot.on("messageCreate", (message) => this.handleMessage(message));
    }

    // This returns an iterator, NOT an array!
    get guilds() {
        return this.bot.guilds.cache.values();
    }

    getGuild(id) {
        return this.bot.guilds.cache.get(id);
    }

};

console.log("Starting app...");
const bot = new Bot();

setInterval(() => {
    fs.writeFileSync("data/last-online", new Date().toUTCString());
}, 1000);