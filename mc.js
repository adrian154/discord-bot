// External dependencies
const WebSocket = require("ws");

// Local dependencies
const config = require("./config.json");

module.exports = class {

    constructor(bot) {
    
        this.bot = bot;
        this.connect();
        this.opened = false;
    
        bot.on("message", message => {

            // prevent infinite loops
            if(message.author.bot) {
                return;
            }

            // check feature status
            if(!bot.serverData.getServer(message.guild).isEnabled("mc.broadcast-discord")) {
                return;
            }

            // send
            if(bot.serverData.isMCChannel(message.channel)) {
                this.send({
                    type: "message",
                    discordTag: message.author.tag,
                    message: message.content
                });
            }

        });
    }

    send(obj) {
        if(this.opened) {
            this.ws.send(JSON.stringify(obj));
        }
    }

    broadcast(message) {
        for(const server in this.bot.guilds) {
            
            // check feature status
            if(!this.bot.serverData.getServer(server).isEnabled("mc.broadcast-mc")) {
                return;
            }
            
            const channel = this.bot.serverData.getMCChannel(server);
            if(channel) {
                channel.send(message).catch(console.error);
            }

        }
    }

    setupEventListeners() {

        this.ws.on("open", () => {
            this.opened = true;
            this.broadcast(":white_check_mark: Connected to Minecraft server");
            this.send({
                type: "auth",
                secret: config.mc.token
            });
        });

        this.ws.on("close", (code, reason) => {
            
            if(this.opened) {
                this.mcBroadcast(":x: Lost connection to Minecraft server");
                this.opened = false;
            }

            // reconnect later
            setTimeout(() => this.connect(), 5000);            

        });

        this.ws.on("error", (data) => {

            // assume the error is fatal
            this.ws.terminate();

        });

        this.ws.on("message", (data) => {
            
            let message;

            switch(data.type) {
                case "chat": message = `\`${data.playerName}: ${data.message.replace(/`/g, "'")}\``; break;
                case "death": message = `:skull_crossbones: \`${data.deathMessage.replace(/§./g, "")}\``; break;
                case "join": message = `:inbox_tray: \`${data.playerName}\` joined.`; break;
                case "quit": message = `:outbox_tray: \`${data.playerName}\` left.`; break;
            }

            if(message) {
                this.broadcast(message);
            }

        });

    }

    async getOnline() {
        return new Promise((resolve, reject) => {

            this.ws = new WebSocket(this.getWSURL());
            
            this.ws.on("message", (message) => {
                message = JSON.parse(message);
                if(message.type === "online") {
                    resolve(data.data);
                }
            });

            // this websocket is a lot less robust
            // one teeny tiny little thing and it gives up and dies
            this.ws.on("close", reject);
            this.ws.on("error", reject);

        });
    }

    getWSURL() {
        return `ws://${config.mc.host}:${config.mc.port}`;
    }

    connect() {
        this.ws = new WebSocket(this.getWSURL());
        this.setupEventListeners();
    }

}