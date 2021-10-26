const Table = require("./table.js");
const {HOUR, MINUTE} = require("./date.js");

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
        this.deleteReminder = this.table.delete("ID = ? AND userID = ?").asFunction();

        this.timeouts = {};
        this.bot.bot.on("ready", () => this.restoreTimeouts());

        // periodically refresh timeouts
        setInterval(() => {
            this.restoreTimeouts();       
        }, 24 * HOUR);

    }

    restoreTimeouts() {
        this.table.select("*").stmt().all().forEach(reminder => {
            if(!this.timeouts[reminder.ID]) {
                this.startTimeout(reminder)
            }
        });
    }

    startTimeout(reminder) {

        if(reminder.timestamp - Date.now() > 2147483647) return;

        this.timeouts[reminder.ID] = setTimeout(async () => {

            const user = await this.bot.bot.users.fetch(reminder.userID);
            let timeout = 1 * MINUTE;

            const remind = () => {
                timeout *= 2;
                user.send(`**REMINDER**: ${reminder.description}\nDo \`$clear ${reminder.ID}\` to acknowledge this reminder, or I will constantly pester you about it. Next reminder in ${timeout / 60 / 1000} minute(s)`);
                this.timeouts[reminder.ID] = setTimeout(remind, timeout);
            };

            remind();

        }, reminder.timestamp - Date.now());

    }

    addReminder(user, description, timestamp) {
        const reminder = this.getReminder(this.insertReminder(description, user.id, timestamp).lastInsertRowid); 
        this.startTimeout(reminder);
    }

    removeReminder(user, id) {
        if(this.deleteReminder(id, user.id).changes > 0) {
            clearTimeout(this.timeouts[id]);
            delete this.timeouts[id];    
            return true;
        }
    }

};

module.exports = Reminders;