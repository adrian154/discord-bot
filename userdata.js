// Local deps
const SCHEMA = require("./util.js").textfile("userdata-schema.sql");

module.exports = class {

    constructor(db) {
        this.db = db;
        this.db.exec(CREATE_QUERY);
        this.createUserStmt = this.prepare("INSERT OR IGNORE INTO userData (userID) VALUES (?)").run(id);
        this.getBalanceStmt = this.prepare("SELECT balance FROM userData WHERE userID = ?");
        this.getDraincoinStmt = this.prepare("SELECT draincoin FROM userData WHERE userID = ?");
    }

    getBalance(id) {
        this.createUserStmt.run(id);
        return this.getColumn(id, "balance");
    }

    setBalance(id, value) {
        this.createUserStmt.run(id);    
    }

    getDrainCoin(id) {
        this.createUserStmt.run(id);  
        return this
    }

    setDrainCoin(id, value) {
        this.createUserStmt.run(id);  
        return this.setColumn(id, "draincoin", value);
    }

};