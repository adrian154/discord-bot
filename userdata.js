// Local deps
const config = require("./config.json").userdata;

const CREATE_QUERY = `CREATE TABLE IF NOT EXISTS userData (
    userID TEXT UNIQUE,
    balance REAL DEFAULT 10000,
    draincoin INTEGER DEFAULT 0
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

    getColumn(id, column) {
        this.initUser(id);
        return this.prepare(`SELECT ${column} FROM userData WHERE userID = ?`).pluck().get(id);
    }

    setColumn(id, column, value) {
        this.initUser(id);
        this.prepare(`UPDATE userData SET ${column} = ? WHERE userID = ?`).run(value, id);
    }

    getBalance(id) { return this.getColumn(id, "balance"); }
    setBalance(id, value) { this.setColumn(id, "balance", value); }

    getDrainCoin(id) { return this.getColumn(id, "draincoin"); }
    setDrainCoin(id, value) { return this.setColumn(id, "draincoin", value); }

};