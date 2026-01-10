import { open } from "sqlite";
import sqlite from "sqlite3";
import path from "node:path";

const logTable = async () => {
    const db = await open({
        filename: path.join("database", "database.db"),
        driver: sqlite.Database
    });


    const res = await db.all(`
                SELECT *
                FROM posts
                    ORDER BY created_at DESC, id DESC
                    LIMIT 10
        `);


    console.table(res);
    console.log("Log table succesfully");
};
logTable();
