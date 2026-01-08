import sqlite from "sqlite3";
import { open } from "sqlite";
import path from "node:path";
import { getDbConnection } from "./getDbConnection.js";

const dropTable = async () => {
    const db = await getDbConnection();

    await db.run("DROP TABLE IF EXISTS posts");

    await db.close();
    console.log("Table dropped succesfully!");
};
dropTable();