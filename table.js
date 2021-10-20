// query making helper
// written while feeling very sick

class Query {

    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
    }

    // export methods
    stmt() {
        return this.db.prepare(this.build().join(" "));
    }

    asFunction(all) {
        const stmt = this.stmt();
        return (stmt.reader ? (all ? stmt.all : stmt.get) : stmt.run).bind(stmt);
    }

    // various query pieces
    or(onFailure) {
        this.onFailure = onFailure;
        return this;
    }

    where(condition) {
        this.wherePart = condition;
        return this;
    }   
    
    orderBy(order) {
        this.orderPart = order;
        return this;
    }

    limit(count) {
        this.limitPart = count;
        return this;
    }

}

class SelectQuery extends Query {

    constructor(db, tableName, columns) {
        super(db, tableName);
        this.columns = columns;
    }

    build() {
        const parts = [];
        parts.push("SELECT", this.columns.join(","), "FROM", this.tableName);
        if(this.wherePart) { parts.push("WHERE", this.wherePart); }
        if(this.orderPart) { parts.push("ORDER BY", this.orderPart); }
        if(this.limitPart) { parts.push("LIMIT", this.limitPart); }
        return parts;
    }

}

class UpdateQuery extends Query {

    constructor(db, tableName, columns) {
        super(db, tableName);
        this.columns = columns;
    }
    
    build() {
        const parts = [];
        parts.push("UPDATE");
        if(this.onFailure) parts.push("OR", this.onFailure);
        parts.push(this.tableName, "SET", Object.entries(this.columns).map(pair => pair.join("=")));
        if(this.wherePart) { parts.push("WHERE", this.wherePart); }
        return parts;
    }

}

class InsertQuery extends Query {

    constructor(db, tableName, columns) {
        super(db, tableName);
        this.columns = columns;
    }

    build() {
        const parts = [];
        parts.push("INSERT");
        if(this.onFailure) parts.push("OR", this.onFailure);
        parts.push("INTO", this.tableName, `(${Object.keys(this.columns).join(",")})`, "VALUES", `(${Object.values(this.columns).join(",")})`);
        return parts;
    }

}

class DeleteQuery extends Query {

    constructor(db, tableName, where) {
        super(db, tableName);
        this.where(where);
    }

    build() {
        const parts = [];
        parts.push("DELETE FROM", this.tableName);
        if(this.wherePart) parts.push("WHERE", this.wherePart);
        return parts;
    }

}

class Table {

    constructor(db, tableName, columns) {
        this.db = db;
        const tmp = db.prepare.bind(db);
        db.prepare = (stmt) => {
            console.log(stmt);
            return tmp(stmt);
        };
        this.table = tableName;
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(",")})`);
    }

    select(...columns) { return new SelectQuery(this.db, this.table, columns); }
    update(columns)    { return new UpdateQuery(this.db, this.table, columns); }
    insert(columns)    { return new InsertQuery(this.db, this.table, columns); }
    delete(where)      { return new DeleteQuery(this.db, this.table, where); }

};

module.exports = Table;