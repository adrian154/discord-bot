// external dep
const Express = require("express");

// local deps
const config = require("./config.json");

// This piece of the bot is used for serving up images
// since Discord does not support data URLs :(
module.exports = class {

    constructor() {
        
        this.express = Express();
        this.icons = {};
        
        // static files
        this.express.use("/static", Express.static("./static"));

        this.express.get("/icon", (req, res) => {
            if(req.params && this.icons[req.query.host]) {
                const icon = this.icons[req.query.host];
                res.setHeader("Content-Type", icon.type);
                res.setHeader("Content-Length", icon.data.length);
                res.send(icon.data);
            } else {
                res.sendStatus(404);
            }
        });

        this.express.use((req, res, next) => {
            res.sendStatus(404);
        });

        this.express.listen(config.web.port, () => {
            console.log("Webend started listening");
        });

    }

    addIcon(host, dataURL) {
    
        const parsed = dataURL.match(/data:([a-z\/]+);base64,([a-zA-Z0-9\+\/=]+)/);
        this.icons[host] = {
            type: parsed[1],
            data: Buffer.from(parsed[2], "base64")
        };
        
        const encodedHost = encodeURIComponent(host).replace(".", "%2E");
        return (config.debug ? "http://localhost" : "https://" + config.web.hostname) + "/icon?host=" + encodedHost;
    
    }

};