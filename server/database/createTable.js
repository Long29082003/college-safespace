import sqlite3 from "sqlite3";
import { execute } from "./wrapper-functions.js";
import path from "node:path";

const createTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            recipient TEXT NOT NULL,
            feelings TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP
        )`;

    try {
        await execute(db, sql)
    } catch (error) {
        console.log("Error in the process of creating table")
    } finally {
        db.close();
    }

    console.log("Function ended");
};

createTable();
