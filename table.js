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

    get() {
        return this.stmt().get.bind("this");
    }

    all() {
        return this.stmt().all.bind("this");
    }

    run() {
        return this.stmt().run.bind("this");
    }

    // various query pieces
    or(onFailure) {
        this.onFailure = onFailure;
        return this;
    }

    where(condition) {
        this.where = condition;
        return this;
    }   
    
    orderBy(order) {
        this.order = order;
        return this;
    }

    limit(count) {
        this.limit = count;
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
        if(this.where) { parts.push("WHERE", this.where); }
        if(this.order) { parts.push("ORDER BY", this.order); }
        if(this.limit) { parts.push("LIMIT", this.limit); }
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
        if(this.where) { parts.push("WHERE", this.where); }
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
        parts.push("INTO", this.tableName, `(${Object.keys(columns).join(",")})`, "VALUES", `(${Object.values(columns).join(",")})`);
        return parts;
    }

}

class DeleteQuery extends Query {

    build() {
        const parts = [];
        parts.push("DELETE FROM", this.tableName);
        if(this.where) parts.push("WHERE", this.where);
        return parts;
    }

}

class Table {

    constructor(db, tableName, columns) {
        this.db = db;
        this.table = tableName;
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(",")})`);
    }

    select(...columns) { return new InsertQuery(this.db, this.table, columns); }
    update(columns)    { return new UpdateQuery(this.db, this.table, columns); }
    insert(columns)    { return new InsertQuery(this.db, this.table, columns); }
    delete()           { return new DeleteQuery(this.db, this.table); }

};

module.exports = Table;