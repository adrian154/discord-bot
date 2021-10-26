const Table = require("./table.js");

class Reminders {

    constructor(db, bot) {

        this.table = new Table(db, "reminders", [
            "ID INTEGER PRIMARY KEY",
            "description TEXT NOT NULL",
            "userID TEXT NOT NULL",
            "timestamp INTEGER NOT NULL"
        ]);

        this.bot = bot;

        // get rid of stale reminders
        this.table.delete("timestamp < ?").stmt().run(Date.now());

        // prepare statements
        this.insertReminder = this.table.insert({description: "?", userID: "?", timestamp: "?"}).asFunction();
        this.getReminders = this.table.select("*").where("userID = ?").asFunction({all: true});
        this.getReminder = this.table.select("*").where("ID = ?").asFunction();
        this.deleteReminder = this.table.delete("ID = ? AND userID = ?");

        this.timeouts = {};
        this.bot.bot.on("ready", () => this.restoreTimeouts());

    }

    restoreTimeouts() {
        this.table.select("*").stmt().all().forEach(reminder => this.startTimeout(reminder));
    }

    startTimeout(reminder) {
        this.timeouts[reminder.ID] = setTimeout(() => {

            this.bot.bot.users.fetch(reminder.userID).then(user => user.send(`**REMINDER**: ${reminder.description}`));

        }, reminder.timestamp - Date.now());
    }

    addReminder(user, description, timestamp) {
        const reminder = this.getReminder(this.insertReminder(description, user.id, timestamp).lastInsertRowid); 
        this.startTimeout(reminder);
    }

    removeReminder(user, id) {
        if(this.deleteReminder(id, user.id).changes > 0) {
            delete this.timeouts[id];    
        }
    }

};

module.exports = Reminders;