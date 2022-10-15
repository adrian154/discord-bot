const Table = require("./crud.js");

class ServerData {
  
    constructor(db) {

        this.table = new Table(db, "featureRules", [
            "ID TEXT NOT NULL",
            "feature TEXT NOT NULL",
            "value INTEGER NOT NULL",
            "PRIMARY KEY (ID, feature)"
        ]);

        this.setFeature = this.table.insert(["ID", "feature", "value"]).or("REPLACE").fn();
        this.getFeature = this.table.select("value").where("feature = ? AND ID = ?").fn({pluck: true});
        this.getFeatures = this.table.select("feature", "value").where("ID = ?").fn({all: true});
        this.reset = this.table.delete("feature = ? AND ID = ?").fn();
        this.resetAll = this.table.delete("ID = ?").fn();

    }

    // evaluate a specific feature endpoint
    evaluate(feature, message) {

        // order of predecence: GREATEST - user, channel, server - LOWEST
        const userRule = this.getFeature(feature, message.author.id);
        if(userRule !== undefined) {
            return userRule;
        }

        const channelRule = this.getFeature(feature, message.channel.id);
        if(channelRule !== undefined) {
            return channelRule;
        }

        const serverRule = this.getFeature(feature, message.guild?.id);
        if(serverRule !== undefined) {
            return serverRule;
        }

        const defaultRule = this.getFeature(feature, "default");
        if(defaultRule !== undefined) {
            return defaultRule;
        }

        // signal no rule was found
        return null;

    }

    // evaluate feature rules, more specific first
    check(feature, message) {

        const parts = feature.split(".");
        while(parts.length > 0) {

            const value = this.evaluate(parts.join("."), message);
            if(value !== null) {
                return value;
            }
            parts.pop();
        }

        // default: disabled
        return false;

    }

};

module.exports = ServerData;