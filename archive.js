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

        this.insert = this.table.insert({messageID: "?", userID: "?", channelID: "?", content: "?", timestamp: "?"}).or("IGNORE").asFunction();

    }

    archive(message) {
        this.insert(message.id, message.author.id, message.channel.id, message.content, message.createdTimestamp);
    }

}

module.exports = Archive;