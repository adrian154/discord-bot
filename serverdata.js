// External deps
const Database = require("better-sqlite3");

// Local deps
const config = require("./config.json").serverdb;

const CREATE_QUERY = `CREATE TABLE IF NOT EXISTS serverData (
    serverID TEXT UNIQUE,
    MCChannel TEXT DEFAULT null,
    voiceLogsChannel TEXT DEFAULT null,
    featureRulesJSON TEXT DEFAULT null
)`;

const Server = class {

    constructor(db, id) {
        this.db = db;
        this.id = id;
        this.db.prepare(`INSERT OR IGNORE INTO serverData (serverID, featureRulesJSON) VALUES (?, ?)`).run(this.id, JSON.stringify(config.defaultPermissions));
        this.rules = JSON.parse(this.select("featureRulesJSON"));
    }

    select(colName) {
        return this.db.prepare(`SELECT ${colName} FROM serverData WHERE serverID = ?`).pluck().get(this.id);
    }

    update(colName, value) {
        return this.db.prepare(`UPDATE serverData SET ${colName} = ? WHERE serverID = ?`).run(value, this.id);
    }

    get MCChannel() { return this.select("MCChannel"); }
    set MCChannel(channel) { this.update("MCChannel", channel.id); }

    get voiceLogsChannel() { return this.select("voiceLogsChannel"); }
    set voiceLogsChannel(channel) { this.update("voiceLogsChannel", channel.id); }

    saveRules() {
        this.update("featureRulesJSON", JSON.stringify(this.rules));
    }

    setRule(feature, value) {

        const parts = feature.split(".");
        let scope = this.rules;

        for(const part of parts) {
            if(!scope[part]) scope[part] = {default: scope.default};
            scope = scope[part];
        }

        scope.default = value;
        this.saveRules();

    }

    isEnabled(feature) {
        
        const parts = feature.split(".");
        let scope = this.rules;

        for(const part of parts) {
            if(part in scope) scope = scope[part];
            else return scope.default;
        }

        return scope.default;

    }

};

module.exports = class {
  
    // The "default" server is used to handle default
    constructor() {
        this.db = new Database(config.path);
        this.db.exec(CREATE_QUERY);
        this.queryCache = {};
        this.serverCache = {};
        this.serverCache.default = new Server(this.db, "default");
    }

    prepare(query) {
        return this.queryCache[query] ?? this.db.prepare(query);
    }

    getServer(server) {
        return (server && server.id) ? (this.serverCache[server.id] ?? (this.serverCache[server.id] = new Server(this.db, server.id))) : this.serverCache.default;
    }

};