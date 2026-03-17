//Todo: Handle case where username match with existing users ✅
//Todo: Handling CORS issues
import { execute, fetchAll } from "../database/wrapper-functions.js";
import sqlite3 from "sqlite3";
import path from "node:path";
import bcrypt from "bcrypt";

import 'dotenv/config';

const SECRET_KEY = process.env["SECRET_KEY"];
const SALT_ROUND = 10;

export async function handleUserRegistration (req, res) {
    let { username, password, secret } = req.body;
    if (!username || !password) return res.sendStatus(401);
    console.log(username, password, secret);

    const salt = bcrypt.genSaltSync(SALT_ROUND);
    password = bcrypt.hash(password, salt);

    const roles = ["user"];
    secret === SECRET_KEY && roles.push("admin");

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const findMatchSql = `
        SELECT * FROM users
            WHERE username = ?
    `;

    const sql = `
        INSERT INTO users (
            username, password, roles
        ) VALUES (?, ?, ?)
    `;

    try {
        const foundUser = await fetchAll(db, findMatchSql, [username]);
        if (foundUser.length !== 0) return res.sendStatus(409);

        await execute(db, sql, [username, password, roles]);
        res.status(201).json({message: "Account receive succesfully"});
    } catch (error) {
        console.log(error);
        res.status(403).json({message: "Error connecting to database"});
    };
};