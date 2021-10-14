const Table = require("./table.js");
const SCHEMA = require("./util.js").textfile("serverdata-schema.sql");

module.exports = class extends Table {
  
    constructor(db) {
        super(db, "features", SCHEMA);
        this.getFeatureQuery = this.select(["value"], "domain = ? AND feature = ?").pluck();
        this.setFeature = this.asFunction(this.insert({domain: "?", feature: "?", value: "?"}, "REPLACE"));
        this.reset = this.asFunction(this.delete("domain = ?"));
        this.getFeatures = this.asFunction(this.select(["feature", "value"], "domain = ?"), true);
    }

    checkFeature(domain, feature) {
        
        const parts = feature.split(".");

        // more specific feature nodes take precedence
        for(const curDomain of [domain || "default", "default"]) {
            while(parts.length > 0) {
                const value = this.getFeatureQuery.get(curDomain, parts.join("."));
                if(value !== undefined) {
                    return Boolean(value);
                }
                parts.pop();
            }
        }

        // default: no features allowed
        return false;

    }

};