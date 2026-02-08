import sqlite3 from "sqlite3";
import { fetchAll } from "./wrapper-functions.js";
import path from "node:path";

const logTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
                SELECT posts.*, COUNT(posts.id) as reaction_count
                FROM posts
                LEFT JOIN reactions
                WHERE posts.id = reactions.post_id
                GROUP BY reactions.post_id
            `;

    const res = await fetchAll(db, sql);

    db.close();

    console.table(res);
    console.log("Log table succesfully");
};
logTable();
