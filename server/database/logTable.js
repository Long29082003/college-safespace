import { open } from "sqlite";
import sqlite from "sqlite3";
import path from "node:path";

const logTable = async () => {
    const db = await open({
        filename: path.join("database", "database.db"),
        driver: sqlite.Database
    });

    const res = await db.all("SELECT * FROM posts");

    console.table(res);
};
logTable();
