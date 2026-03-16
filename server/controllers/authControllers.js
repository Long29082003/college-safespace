import { execute } from "../database/wrapper-functions.js";
import sqlite3 from "sqlite3";
import path from "node:path";
import bcrypt from "bcrypt";

import 'dotenv/config';

const SECRET_KEY = process.env["SECRET_KEY"];
const SALT_ROUND = 10;

export async function handleUserRegistration (req, res) {
    let { username, password, secret } = req.body;
    if (!username || !password) return res.sendStatus(401);

    const salt = bcrypt.genSaltSync(SALT_ROUND);
    password = bcrypt.hash(password, salt);

    const roles = ["user"];
    secret === SECRET_KEY && roles.push("admin");

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        INSERT INTO users (
            username, password, roles
        ) VALUES (?, ?, ?)
    `;

    try {
        await execute(db, sql, [username, password, roles]);
        res.status(201).json({message: "Account receive succesfully"});
    } catch (error) {
        res.status(403).json({message: "Error connecting to database"});
    };
};