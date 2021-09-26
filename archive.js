const Database = require("better-sqlite3");
const config = require("./config.json").archive;

// database
const db = new Database(config.path);

db.exec(`CREATE TABLE IF NOT EXISTS messages (
    channelID INTEGER,
    userID INTEGER,
    messageID INTEGER NOT NULL PRIMARY KEY,
    content TEXT,
    timestamp INTEGER
)`);

const insertStmt = db.prepare(`INSERT OR IGNORE INTO messages (messageID, userID, channelID, content, timestamp) VALUES (?, ?, ?, ?, ?)`);

module.exports = {
    archive: message => {
        insertStmt.run(message.id, message.author.id, message.channel.id, message.content, message.createdTimestamp);
    }
};