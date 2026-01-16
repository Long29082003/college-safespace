import sqlite3 from "sqlite3";
import { execute } from "./wrapper-functions.js";
import path from "node:path";

const createPostsTable = async () => {
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

const createCommentsTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            message TEXT NOT NULL,
            post_id INTEGER REFERENCES posts(id),
            created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP
        )
    `;

    try {
        await execute(db, sql)
        console.log("Create table succesfully");
    } catch (error) {
        console.log("Error creating table", error);
    } finally {
        db.close();
    };

    console.log("Function ended");
};

createCommentsTable();
