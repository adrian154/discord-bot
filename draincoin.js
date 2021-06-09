const config = require("./config.json");
const https = require("https");
const fs = require("fs"); 
const WebSocket = require("ws");

let price = 100;
const wss = config.debug ? 
        new WebSocket.Server({port: config.draincoin.port})
    :
        (() => {
            const httpServer = https.createServer({
                key: fs.readFileSync(config.web.keyPath),
                cert: fs.readFileSync(config.web.certPath)
            });
            httpServer.listen(config.draincoin.port);
            return new WebSocket.Server({server: httpServer});
        })();

// update interval
setInterval(() => {
    if(price > 20) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const change = Math.random() * Math.random() * direction * (price / 2);
        price = Math.max(1, price + change);
    } else {
        price += Math.random() * 5;
    }
    for(const client of wss.clients) {
        client.send(JSON.stringify({price: price}));
    }
}, config.draincoin.interval);

module.exports = {
    getPrice: () => price
};