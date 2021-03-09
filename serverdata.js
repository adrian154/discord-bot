const fs = require("fs");
const path = require("path");

// Server data manager
module.exports = class {

    constructor(bot) {

        this.bot = bot;
        this.data = {};

        if(!fs.existsSync("./serverdata")) {
            fs.mkdirSync("./serverdata");
        }

        // Load datafiles
        for(const guild of this.bot.guilds) {
            if(!fs.existsSync(`./serverdata/${guild.id}.JSON`)) {
                this.initServer(guild);
            } else {
                this.reloadData(guild.id);
             }
        }

        this.bot.on("guildCreate", guild => {
            this.initServer(guild);
        });

    }

    reloadData(serverID) {
        const filePath = path.resolve(`serverdata/${serverID}.json`);
        fs.readFile(filePath, {encoding: "utf-8"}, (err, data) => {
            if(err) {
                console.log("Failed to open datafile: " + err);
            } else {
                try {
                    const obj = JSON.parse(data);
                    this.data[obj.serverID] = obj;
                } catch(err) {
                    console.log("Failed to read datafile: " + err);
                }
            }
        });
    }

    initServer(server) {
        this.data[server.id] = {serverID: server.id};
        this.writeData(server.id);
    }

    writeData(serverID) {
        fs.writeFile(`./serverdata/${serverID}.json`, JSON.stringify(this.data[serverID]), {encoding: "utf-8"}, err => {
            if(err) throw err;
        });
    }

    saveAll() {
        for(const server in this.data) {
            this.writeData(server);
        }
    }

    setMCChannel(server, channel) {
        this.data[server.id].MCChannel = channel.id;
        this.writeData(server.id);
    }

    getMCChannel(server) {
        const id = this.data[server.id].MCChannel;
        return id ?? server.channels.cache.get(id);
    }

    isMCChannel(channel) {
        return channel.id === this.data[channel.guild.id].MCChannel;
    }

};