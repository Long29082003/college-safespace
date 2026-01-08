import sqlite from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

export const getDbConnection = async () => {
    return await open({
        filename: path.join("database", "database.db"),
        driver: sqlite.Database
    });
};