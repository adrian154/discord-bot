const Database = require("better-sqlite3"); 
const Table = require("./crud.js");

const db = new Database("data/rules.db");

const table = new Table(db, "rules", [
    "scopeType TEXT NOT NULL",
    "scopeId TEXT NOT NULL",
    "key TEXT NOT NULL",
    "value INTEGER NOT NULL",
    "PRIMARY KEY (scopeId, key)"
]);

const getRule = table.select("value").where("scopeId = ? AND key = ?").fn();
const getRules = table.select("*").fn({all: true});
const addRule = table.insert(["scopeType", "scopeId", "key", "value"]).or("replace").fn();
const deleteRule = table.delete("scopeId = ? AND key = ?").fn();

module.exports = {
    get: (key, guildId, channelId, userId) => {
        return getRule(userId, key) ||
               getRule(channelId, key) ||
               getRule(guildId, key) ||
               getRule("global", key);
    },
    getForMessage: (specificKey, generalKey, message) => {

        const specificRule = module.exports.get(specificKey, message.guild?.id, message.channel.id, message.author.id);
        if(specificRule) {
            return specificRule.value;
        }

        const generalRule = module.exports.get(generalKey, message.guild?.id, message.channel.id, message.author.id);
        if(generalRule) {
            return generalRule.value;
        }

        return false;

    },
    getRules,
    addRule,
    deleteRule
};