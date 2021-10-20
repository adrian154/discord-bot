const Table = require("./table.js");

module.exports = class {
  
    constructor(db) {

        this.table = new Table(db, "features", [
            "domain TEXT NOT NULL",
            "feature TEXT NOT NULL",
            "value INTEGER NOT NULL",
            "PRIMARY KEY (domain, feature)"
        ]);

        this.setFeature = this.table.insert({domain: "?", feature: "?", value: "?"}).or("REPLACE").asFunction();
        this.getFeature = this.table.select("value").where("domain = ? AND feature = ?").asFunction();
        this.getFeatures = this.table.select("feature", "value").where("domain = ?").asFunction(true);
        this.reset = this.table.delete("domain = ? AND feature = ?").asFunction();
        this.resetAll = this.table.delete("domain = ?").asFunction();

    }

    evaluateRules(feature, domain) {
        
        // iterate more specific feature rules first
        const parts = feature.split(".");
        while(parts.length > 0) {

            // destructuring, i'm such a smart guy
            const value = this.getFeature(domain, parts.join("."))?.value;
            if(value !== undefined) {
                return Boolean(value);
            }
            
            parts.pop();

        }

        // signal that no record was found
        return null;

    }

    checkFeature(domain, feature) {

        const parts = ["default", ...domain.split(".")];
        while(parts.length > 0) {

            const value = this.evaluateRules(feature, parts.join("."));
            if(value !== null) {
                return value;
            }

            parts.pop();

        }

    }

};
