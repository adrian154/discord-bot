// sqlite helper

class Query {

    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
        this.parts = [];
    }

    // export methods
    statement() {
        const query = this.build();
        console.log(query);
        return this.db.prepare(query);
    }

    asFunction(options) {
        
        const stmt = this.statement();
        
        // apply options
        if(options?.pluck) {
            if(!stmt.reader) {
                throw new Error("Can't pluck a statement that doesn't read any data");
            } 
            stmt.pluck();
        }

        // return the appropriate option
        return (stmt.reader ? (options?.all ? stmt.all : stmt.get) : stmt.run).bind(stmt);

    }

    // builder methods
    or(fallback) { this.fallback = fallback; return this; }
    where(condition) { this.condition = condition; return this; }   

    // internal methods
    build() {
        return this.parts.join(" ");
    }

    put(...parts) {
        this.parts.push(...parts);
    }

    putClause(clauseName, value) {
        if(value) this.parts.push(clauseName, value);
    }

}

class SelectQuery extends Query {

    constructor(db, tableName, columns) {
        super(db, tableName);
        this.columns = columns;
    }

    orderBy(order) { this.order = order; return this; }
    limit(count) { this.count = count; return this; }
    or() { throw new Error("OR clause can't be applied to INSERT"); }

    build() {
        this.put("SELECT", this.columns.join(","), "FROM", this.tableName);
        this.putClause("WHERE", this.condition);
        this.putClause("ORDER BY", this.order);
        this.putClause("LIMIT", this.count);
        return super.build();
    }

}

class UpdateQuery extends Query {

    constructor(db, tableName, columns) {
        super(db, tableName);
        this.columns = columns;
    }
    
    build() {
        this.put("UPDATE");
        this.putClause("OR", this.fallback);
        this.put(this.tableName);
        this.put("SET", Object.entries(this.columns).map(pair => pair.join("=")));
        this.putClause("WHERE", this.condition);
        return super.build();
    }

}

class InsertQuery extends Query {

    constructor(db, tableName, columns) {
        super(db, tableName);
        this.columns = columns;
    }

    where() { throw new Error("WHERE clause can't be applied to INSERT"); }

    build() {
        this.put("INSERT");
        this.putClause("OR", this.fallback);
        this.put(
            "INTO", this.tableName,
            `(${this.columns.join(",")})`,
            "VALUES", `(${this.columns.map(col => ":" + col).join(",")})`    
        );
        return super.build();
    }

}

class DeleteQuery extends Query {

    constructor(db, tableName, where) {
        super(db, tableName);
        this.where(where);
    }

    or() { throw new Error("OR clause can't be applied to DELETE"); }

    build() {
        this.put("DELETE FROM", this.tableName);
        this.putClause("WHERE", this.condition);
        return super.build();
    }

}

class Table {

    // `columns` includes columns and constraints
    constructor(db, tableName, columns) {
        this.db = db;
        this.table = tableName;
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(",")})`);
    }

    select(...columns) { return new SelectQuery(this.db, this.table, columns); }
    update(columns)    { return new UpdateQuery(this.db, this.table, columns); }
    insert(...columns) { return new InsertQuery(this.db, this.table, columns); }
    delete(where)      { return new DeleteQuery(this.db, this.table, where); }

};

module.exports = Table;