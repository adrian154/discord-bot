const Database = require("better-sqlite3");
const { DMChannel } = require("discord.js");
const db = new Database("data/archive2.db");

db.pragma("foreign_keys = ON");

db.exec(`CREATE TABLE IF NOT EXISTS guilds (
    guildID STRING PRIMARY KEY,
    guildName TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS channels (
    channelID STRING PRIMARY KEY,
    channelName TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS users (
    userID STRING PRIMARY KEY,
    tag TEXT NOT NULL,
    bot INTEGER NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS messages (
    messageID STRING PRIMARY KEY,
    guildID STRING,
    channelID STRING,
    authorID STRING,
    content TEXT,
    attachments TEXT,
    reference TEXT,
    timestamp INTEGER,
    FOREIGN KEY(guildID) REFERENCES guilds(guildID),
    FOREIGN KEY(channelID) REFERENCES channels(channelID),
    FOREIGN KEY(authorID) REFERENCES users(userID)
)`);

const insertGuild = db.prepare("INSERT OR REPLACE INTO guilds (guildId, guildName) VALUES (?, ?)"),
      insertChannel = db.prepare("INSERT OR REPLACE INTO channels (channelId, channelName) VALUES (?, ?)"),
      insertUser = db.prepare("INSERT OR REPLACE INTO users (userId, tag, bot) VALUES (?, ?, ?)"),
      insertMessage = db.prepare("INSERT OR IGNORE INTO messages (messageID, guildID, channelID, authorID, content, attachments, reference, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

// keep track of guild, channel, and usernames 
// this lets us know if we need to update the database entries without actually performing a query
const guilds = {}, channels = {}, users = {};

db.prepare("SELECT * FROM guilds").all().forEach(guild => guilds[guild.guildID] = guild.guildName);
db.prepare("SELECT * FROM channels").all().forEach(channel => channels[channel.channelID] = channel.channelName);
db.prepare("SELECT * FROM users").all().forEach(user => users[user.userID] = user.tag);

module.exports = {
    archive: (message, noTransaction) => {

        if(!noTransaction) {
            db.prepare("BEGIN").run();
        }

        // ignore messages that aren't from actual users
        if(!message.author || message.system) {
            return;
        }

        if(message.guildId && guilds[message.guildId] != message.guild.name) {
            guilds[message.guildId] = message.guild.name;
            insertGuild.run(message.guildId, message.guild.name);
        }

        const channelName = message.channel instanceof DMChannel ? `DM with ${message.channel.recipient.tag}` : message.channel.name;
        if(message.channelId && channels[message.channelId] != channelName) {
            channels[message.channelId] = channelName;
            insertChannel.run(message.channelId, channelName);
        }

        if(users[message.author.id] != message.author.tag) {
            users[message.author.id] = message.author.tag;
            insertUser.run(message.author.id, message.author.tag, Number(Boolean(message.author.bot)));
        }

        insertMessage.run(
            message.id,
            message.guildId,
            message.channelId,
            message.author.id,
            message.content,
            message.attachments && JSON.stringify(message.attachments.map(attachment => attachment.url)),
            message.reference?.messageId,
            message.createdTimestamp
        );        

        if(!noTransaction) {
            db.prepare("COMMIT").run();
        }

    },
    beginTransaction: () => db.prepare("BEGIN").run(),
    commit: () => db.prepare("COMMIT").run()
};