CREATE TABLE IF NOT EXISTS draincoinUsers (
    userID TEXT UNIQUE,
    balance REAL DEFAULT 10000 NOT NULL,
    draincoin INTEGER DEFAULT 0 NOT NULL
);