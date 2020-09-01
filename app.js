const Discord = require("discord.js");
const bot = new Discord.Client();
const token = require("./token.js");
const WebSocket = require("ws");
const prose = require("./prose.js");

// Self constants
const cmdPrefix = "$";

// Bot state
let annoyingMode = false;

// Helper funcs
const afRepeat = function(message) {
    message.channel.send(message.content);
};

const annoyingFuncs = [afRepeat];

const respondAnnoying = function(message) {
    annoyingFuncs[Math.floor(Math.random() * annoyingFuncs.length)](message);
};

// App funcs
let ws = new WebSocket("ws://localhost:1738");

ws.on("message", data => {
    
    let obj = JSON.parse(data);

    for(let guild of bot.guilds.cache) {
        let channels = guild[1].channels.cache;
        let channel  = channels.find(channel => channel.name === "mc");
        if(channel !== undefined) {
            if(obj.type === "chat") {
                channel.send(`\`<${obj.playerName}> ${obj.message.replace(/`/g, "\\`")}\``);
            } else if(obj.type === "death") {
                channel.send(`:skull_crossbones: \`${obj.message}\``);
            } else if(obj.type === "join") {
                channel.send(`:inbox_tray: \`${obj.playerName}\` joined.`);
            } else if(obj.type === "quit") {
                channel.send(`:outbox_tray: \`${obj.playerName}\` left.`);
            }
        }
    }
});

bot.on("ready", () => {
    console.log(`logged in as ${bot.user.tag}`);
});

bot.on("message", (message) => {

    let content = message.content;
    let channel = message.channel;

    // High-priority (commands)
    if(content[0] === "$") {

        let split = content.split(" ");
        let command = split[0].substring(1);

        if(command === "help") {
            channel.send([
                "`$haiku` - generate a random haiku",
                "`$dice [type]` - roll some dice"
            ].join("\n"));
        }

        if(command === "haiku") {
            channel.send(`\`\`\`${prose.createHaiku()}\`\`\``);
            return;
        }
        
        if(command === "dice") {
        
            // Default is 1d6
            let dice = "1d6";
            if(split.length >= 2) {
                dice = split[1];
            }

            // Parse
            let params = dice.split("d");
            
            if(params.length != 2) {
                channel.send("invalid parameter (expected normal dice notation)");
            }

            if(isNaN(Number(params[0])) || isNaN(Number(params[1]))) {
                channel.send("invalid number");
            }

            // Roll
            let numRolls = Number(params[0]);
            let range = Number(params[1]);
            let rollsText = "";
            for(let i = 0; i < numRolls; i++) {
                rollsText += (Math.floor(Math.random() * range) + 1) + (i == numRolls - 1 ? "" : ", ");
            }

            channel.send(`you rolled: ${rollsText}`);

            return;
        }

        if(command === "online") {
            let tempWS = new WebSocket("ws://localhost:1738");
            tempWS.on("ready", () => {
                tempWS.send(JSON.stringify({type: "getOnline"}));
            });
            tempWS.on("message", data => {
                console.log(data);
                if(data.type === "online") {
                    channel.send(data.payload);
                }
            });
        }

    }

    // Low priority (triggers for non bot messages)
    if(message.author.bot) {
        return;
    }

    if(content === "go stupid") {
        annoyingMode = true;
        return;
    }

    if(content === "go normal") {
        annoyingMode = false;
        return;
    }

    if(content === "sanity") {
        channel.send(`currently: ${annoyingMode ? "stupid" : "sane"}`);
        return;
    }
    
    if(content.indexOf("guy") >= 0 && content.indexOf("gets") >= 0 && content.indexOf("it") >= 0) {
        channel.send("^ this guy gets it");
        return;
    }

    // Minimum priority (regular messages)
    if(annoyingMode) {
        respondAnnoying(message);
    }

    if(channel.name === "mc") {
        ws.send(JSON.stringify({type: "message", discordTag: message.author.tag, message: content}));
    }

});

bot.login(token);
