// Local deps
const config = require("./config.json").userdata;

const CREATE_QUERY = `CREATE TABLE IF NOT EXISTS userData (
    userID TEXT UNIQUE,
    balance REAL DEFAULT 10000
)`;

module.exports = class {

    constructor(db) {
        this.db = db;
        this.db.exec(CREATE_QUERY);
        this.queryCache = {};
    }

    prepare(query) {
        return this.queryCache[query] ?? (this.queryCache[query] = this.db.prepare(query));
    }

    initUser(id) {
        this.prepare(`INSERT OR IGNORE INTO userData (userID) VALUES (?)`).run(id);
    }

    getBalance(id) {
        this.initUser(id);
        return this.prepare(`SELECT balance FROM userData WHERE userID = ?`).pluck().get(id);
    }

    setBalance(id, balance) {
        this.initUser(id);
        this.prepare(`UPDATE userData SET balance = ? WHERE userID = ?`).run(balance, id);
    }

};