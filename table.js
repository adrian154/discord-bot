module.exports = class {

    constructor(db, name, schema) {
        db.exec(schema);
        this.db = db;
        this.name = name;
    }

    select(columns, condition, options) {
        return this.db.prepare(`SELECT ${columns.join(",")} FROM ${this.name} WHERE ${condition || "1"} ${options?.order ? `ORDER BY ${options.order}` : ""} ${options?.limit ? `LIMIT ${options.limit}` : ""}`);
    }

    update(columns, options) {  
        return this.db.prepare(`UPDATE OR ${options?.fallback || "ABORT"} ${this.name} SET ${Object.keys(columns).map(col => `${col}=${columns[col]}`).join(", ")} WHERE ${options.condition || "1"}`);
    }

    // NB: this wouldn't work everywhere because Object.keys() doesn't have to return the keys in order
    // but this code will never run outside of Node/V8, so this is of no consequence
    insert(columns, fallback = "ABORT") {
        return this.db.prepare(`INSERT OR ${fallback} INTO ${this.name} (${Object.keys(columns).join(", ")}) VALUES (${Object.values(columns).join(", ")})`);
    }

    delete(condition) {
        return this.db.prepare(`DELETE FROM ${this.name} WHERE ${condition}`);
    }

    asFunction(stmt, all) {
        if(all) {
            return (...params) => stmt.all(params);
        }
        return (...params) => console.log(params);
        //return (...params) => stmt.reader ? stmt.get(params) : stmt.run(params);
    }

    transaction(statements) {
        return this.db.transaction((data) => {
            for(const stmt of statements) {
                stmt.run(data);
            }
        });
    }

};