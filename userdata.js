// Local deps
const Table = require("./table.js");
const SCHEMA = require("./util.js").textfile("userdata-schema.sql");

module.exports = class extends Table{

    constructor(db) {
        super(db, "draincoinData", SCHEMA);

        this.initUserQuery = this.asFunction(this.insertStmt({userID: "?"}, "IGNORE"));
        this.getBalanceQuery = this.asFunction(this.selectStmt("balance", "userID = ?"));
        this.getDraincoinQuery = this.asFunction(this.selectStmt("draincoin", "userID = ?"));
        this.setDrainCoinQuery = this.asFunction(this.updateStmt({"draincoin": "@2"}, {condition: "userID = @1", fallback: "IGNORE"}));

    }

    getBalance(id) {
        this.initUserQuery(id);
        return this.getBalanceQuery(id);
    }

    setBalance(id, value) {
        this.initUserQuery(id);
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