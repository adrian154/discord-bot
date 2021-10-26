const Table = require("./table.js");

module.exports = class {

    constructor(db, bot) {

        this.table = new Table(db, "reminders", [
            "ID INTEGER PRIMARY KEY",
            "description TEXT NOT NULL",
            "userID TEXT NOT NULL",
            "timestamp INTEGER NOT NULL"
        ]);

        // get rid of stale reminders
        this.table.delete("timestamp < ?").stmt().run(Date.now());

        // prepare statements
        this.insertReminder = this.table.insert({description: "?", userID: "?", timestamp: "?"}).asFunction();
        this.getReminders = this.table.select("ID", "description").where("userID = ?").asFunction({all: true});
        this.deleteReminder = this.table.delete("ID = ? AND userID = ?");

        this.timeouts = {};
        this.table.select("*").stmt().run().forEach(reminder => this.startTimeout(reminder));

    }

    startTimeout(reminder) {
        this.timeouts[reminder.ID] = setTimeout(() => {
            
        }, reminder.timestamp - Date.now());
    }

    addReminder(user, description, timestamp) {
        this.insertReminder(description, user.id, timestamp);    
    }

    removeReminder(user, id) {
        if(this.deleteReminder(id, user.id).changes > 0) {
            delete this.timeouts[id];    
        }
    }

};