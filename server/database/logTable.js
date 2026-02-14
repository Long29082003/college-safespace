import sqlite3 from "sqlite3";
import { fetchAll } from "./wrapper-functions.js";
import path from "node:path";

const logTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
                SELECT post_id, COUNT(id) as reactions_count
                FROM reactions
                WHERE reactions.post_id IN (17)
                GROUP BY post_id
            `;

    const res = await fetchAll(db, sql);

    db.close();

    console.table(res);
    console.log("Log table succesfully");
};
logTable();
