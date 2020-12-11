// External dependencies
const WebSocket = require("ws");

// Local dependencies
const config = require("./config.json");

module.exports = class {

    constructor() {

        this.eventRecipients = [];
        this.connect();
        this.opened = false;

    }

    addEventRecipient(who) {
        this.eventRecipients.push(who);
    }

    send(obj) {
        if(this.opened) {
            this.ws.send(JSON.stringify(obj));
        }
    }

    broadcastEvent(data) {
        for(let recipient of this.eventRecipients) {
            recipient.handleMCEvent(data);
        }
    }

    setupEventListeners() {

        this.ws.on("open", () => {
            
            this.opened = true;

            this.broadcastEvent({
                type: "connected"
            })

            this.send({
                type: "auth",
                secret: config.mc.token
            });

        });

        this.ws.on("close", (code, reason) => {
            
            if(this.opened) {
                
                this.broadcastEvent({
                    type: "connectionLost"
                });
                
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
            console.log(data);
            this.broadcastEvent({
                type: "incomingMessage",
                data: JSON.parse(data)
            })
        });

    }

    announceDiscordChat(message) {
        this.send({
            type: "message",
            discordTag: message.author.tag,
            message: message.content
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
            this.ws.on("close", (code, reason) => reject());
            this.ws.on("error", (data) => reject());

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