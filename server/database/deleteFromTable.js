import { execute } from "./wrapper-functions.js";
import sqlite3 from "sqlite3";
import path from "node:path";

const deleteFromTable = async () => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        DELETE FROM posts
            WHERE id IN(51,52)
    `;

    try {
        await execute(db, sql);
        console.log("Delete items from table successfully");
    } catch (error) {
        console.log("Error when deleting items: ", error);
    } finally {
        db.close();
    };

    console.log("Function ended");
};

deleteFromTable();