// External dependencies
const WebSocket = require("ws");

// Local dependencies
const config = require("./config.json");

module.exports = class {

    constructor() {

        this.eventRecipients = [];
        this.connect();

    }

    addEventRecipient(who) {
        this.eventRecipients.add(who);
    }

    send(obj) {
        this.ws.send(JSON.stringify(obj));
    }

    broadcastEvent(data) {
        for(let recipient of this.eventRecipients) {
            recipient.handleMCEvent(data);
        }
    }

    setupEventListeners() {

        this.ws.on("open", () => {
            
            this.broadcastEvent({
                type: "connected"
            })

            this.send({
                type: "auth",
                secret: config.mc.token
            });

        });

        this.ws.on("close", (code, reason) => {
            
            this.broadcastEvent({
                type: "connectionClosed"
            });

            // reconnect later
            setTimeout(this.connect, 5000);            

        });

        this.ws.on("error", (data) => {
            
            this.broadcastEvent({
                type: "connectionError"
            });

            // assume the error is fatal
            // die
            this.ws.terminate();

            // reconnect later
            setTimeout(this.connect, 5000);

        });

        this.ws.on("message", (data) => {
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

            this.ws = this.makeWS();
            
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

    makeWS() {
        return new WebSocket(`ws://${config.mc.host}:${config.mc.port}`);
    }

    connect() {
        this.ws = this.makeWS();
        setupEventListeners();
    }

}