const Table = require("./table.js");
const SCHEMA = require("./util.js").textfile("serverdata-schema.sql");

module.exports = class extends Table {
  
    constructor(db) {
        super(db, "serverFeatures", SCHEMA);
        this.getFeatureQuery = this.select(["value"], "serverID = ? AND feature = ?").pluck();
        this.setFeature = this.asFunction(this.insert({value: "@3", feature: "@2", serverID: "@1"}));
        this.reset = this.asFunction(this.delete("serverID = ?"));
        this.getFeatures = this.asFunction(this.select(["feature", "value"], "serverID = ?"), true);
    }

    checkFeature(serverID, feature) {
        
        console.log(feature);
        const parts = feature.split(".");

        // more specific feature nodes take precedence
        while(parts.length > 0) {
            const value = this.getFeatureQuery.get(serverID, parts.join("."));
            if(value !== undefined) {
                return Boolean(value);
            }
            parts.pop();
        }

        // default: no features allowed
        return false;

    }

};