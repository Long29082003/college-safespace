import sqlite3 from "sqlite3";
import { fetchAll } from "./wrapper-functions.js";
import path from "node:path";

const logTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
                SELECT *
                FROM posts
                    ORDER BY created_at DESC, id DESC
                    LIMIT 10
            `;

    const res = await fetchAll(db, sql);

    db.close();

    console.table(res);
    console.log("Log table succesfully");
};
logTable();
