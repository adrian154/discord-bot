// Local deps
const SCHEMA = require("./util.js").textfile("serverdata-schema.sql");

module.exports = class {
  
    constructor(db) {
        this.db = db;
        this.db.exec(SCHEMA);
        this.checkFeatureStmt = this.db.prepare("SELECT value FROM serverFeatures WHERE serverID = ? AND feature = ?").pluck();
        this.setFeatureStmt = this.db.prepare("INSERT OR REPLACE INTO serverFeatures SET value = ? WHERE serverID = ? AND feature = ?");
        this.resetStmt = this.db.prepare("DELETE FROM serverFeatures WHERE serverID = ?");
        this.getFeaturesStmt = this.db.prepare("SELECT feature, value FROM serverFeatures WHERE serverID = ?");
    }

    checkFeature(serverID, feature) {
        
        const parts = feature.split(".");

        // more specific feature nodes take precedence
        while(parts.length > 0) {
            const value = this.checkFeatureStmt.get(serverID, parts.join("."));
            if(value !== undefined) {
                return Boolean(value);
            }
            value.pop();
        }

        // default: no features allowed
        return false;

    }

    setFeature(serverID, feature, value) {
        this.setFeatureStmt.run(value, serverID, feature);
    }

    reset(serverID) {
        this.resetStmt.run(serverID);
    }

    getFeatures(serverID) {
        return this.getFeaturesStmt.all(serverID);
    }

};