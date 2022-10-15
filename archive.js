const Database = require("better-sqlite3");
const Table = require("./crud.js");

const table = new Table(new Database("data/archive.db"), "messages", [
    "channelID INTEGER",
    "userID INTEGER",
    "messageID INTEGER NOT NULL PRIMARY KEY",
    "content TEXT",
    "timestamp INTEGER"
]);

const insert = table.insert(["messageID", "userID", "channelID", "content", "timestamp"]).or("IGNORE").fn();
const getStats = table.select("COUNT(*) as messages", "COUNT(DISTINCT channelID) as channels", "COUNT(DISTINCT userID) as users").fn();

module.exports = {
    archive: message => insert({
        messageID: message.id,
        userID: message.author.id,
        channelID: message.channel.id,
        content: message.content,
        timestamp: message.createdTimestamp
    }),
    getStats
};