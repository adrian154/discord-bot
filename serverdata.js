const Table = require("./table.js");
const SCHEMA = require("./util.js").textfile("serverdata-schema.sql");

module.exports = class extends Table {
  
    constructor(db) {

        this.table = new Table(db, "features", [
            "domain TEXT",
            "feature TEXT NOT NULL",
            "value INTEGER NOT NULL",
            "PRIMARY KEY (domain, feature)"
        ]);

        this.setFeature = this.table.insert({domain: "?", feature: "?", value: "?"}).or("REPLACE").run();
        this.getFeature = this.table.select("value").where("domain = ? AND feature = ?").get();
        this.getFeatures = this.table.select("feature", "value").where("domain = ?").all();
        this.reset = this.table.delete("domain = ? AND feature = ?").run();
        this.resetAll = this.table.delete("domain = ?").run();

    }

    checkFeature(feature, domain) {
        
        for(const curDomain of [domain || "default", "default"]) {
            
            // iterate more specific feature rules first
            const parts = feature.split(".");
            while(parts.length > 0) {

                // destructuring, i'm such a smart guy
                const {value} = this.getFeatureQuery(curDomain, parts.join("."));
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