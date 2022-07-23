const config = require("./config.json").archive;
const Database = require("better-sqlite3");
const Table = require("./table.js");

class Archive {

    constructor() {

        this.table = new Table(new Database(config.path), "messages", [
            "channelID INTEGER",
            "userID INTEGER",
            "messageID INTEGER NOT NULL PRIMARY KEY",
            "content TEXT",
            "timestamp INTEGER"
        ]);

        this.insert = this.table.insert("messageID", "userID", "channelID", "content", "timestamp").or("IGNORE").asFunction();
        this.stats = this.table.select("COUNT(*)", "COUNT(DISTINCT channelID)", "COUNT(DISTINCT userID)").asFunction();

    }

    archive(message) {
        this.insert({
            messageID: message.id,
            userID: message.author.id,
            channelID: message.channel.id,
            content: message.content,
            timestamp: message.createdTimestamp
        });
    }

}

module.exports = Archive;