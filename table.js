module.exports = class {

    constructor(db, tableName, schema) {
        db.exec(schema);
    }

    selectStmt(columns, condition) {

    }

    // options = {fallback, condition}
    updateStmt(columns, options) {

    }

    insertStmt() {
        
    }

};