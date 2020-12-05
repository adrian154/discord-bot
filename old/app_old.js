// ----- External deps
const Discord = require("discord.js");
const WebSocket = require("ws");

// ----- Internal deps
const prose = require("./prose.js");
const config = require("./config.json");

// ----- Create bot
const bot = new Discord.Client();

// ----- Bot state
const mcChannels = new Map();

// ----- Bot functions
const broadcastMC = (message) => {
    for(let channel of mcChannels.keys()) {
        channel.send(message);
    }
}

const commandHandlers = {
    "help": 1,
    "haiku": 1,
    "dice": 1,
    "online": 1,
    "mc": 1
};

const handleCommand = (command) => {

};

// ----- Install event handlers

bot.on("ready", () => {

    console.log(`logged in as ${bot.user.tag}`);

    // create map of guilds and mc channels
    for(let guild of bot.guilds) {

        let channel = guild.channels.cache.find(channel => channel.name === config.mc.channelName);
        if(channel) mcChannels.set(guild, channel);

    }

});

bot.on("message", (message) => {

    let content = message.content;
    let channel = message.channel;

    // High-priority (commands)
    if(content[0] === cmdPrefix) {

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
                tempWS.send("getonline");
            });
            tempWS.on("message", data => {
                if(data.type === "online") {
                    channel.send(data.payload);
                }
            });
            return;
        }

        if(command === "secretsanta") {
            
            const data = require("secret-santa-data.json");
            console.log(data);

            for(let i = data.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * i);
                let temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }

            console.log(data);

        }

    }

    // Low priority (triggers for non bot messages)
    // Barrier: never respond to bot messages
    if(message.author.bot) {
        return;
    }

    if(channel.name === "mc") {
        ws.send(`message,${message.author.tag},${content}`);
    }

});

bot.login(config.token);

// Set up websocket
let ws = new WebSocket("ws://mc.codesoup.dev:1738");
let mcChannels;

const prepareWS = function(ws) {

    ws.on("error", data => {
        console.log("error");
    });

    ws.on("close", data => {
        
        console.log("closed");

        /*
        if(mcChannel) {
            mcChannel.send(`:x: Lost connection with server`);
        }*/

    });

    ws.on("message", data => {
        let obj = JSON.parse(data);

        for(let guild of bot.guilds.cache) {
            if(channel !== undefined) {
                if(obj.type === "chat") {
                    channel.send(`\`<${obj.who}> ${obj.message}\``);
                } else if(obj.type === "death") {
                    channel.send(`:skull_crossbones: \`${obj.message}\``);
                } else if(obj.type === "join") {
                    channel.send(`:inbox_tray: \`${obj.name}\` joined.`);
                } else if(obj.type === "quit") {
                    channel.send(`:outbox_tray: \`${obj.name}\` left.`);
                }
            }
        }
    });

};
