import sqlite from "sqlite3";
import {open} from "sqlite";
import path from "node:path";

const createTable = async () => {
    const db = await open({
        filename: path.join("database", "database.db"),
        driver: sqlite.Database
    });

    await db.exec(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            recipient TEXT NOT NULL,
            feelings TEXT[] NOT NULL,
            message TEXT NOT NULL
        )`);

    await db.close();
    console.log("Table create succesfully");
};

createTable();
