//Todo: Handle case where username match with existing users ✅
//Todo: Handling CORS issues
import { execute, fetchAll } from "../database/wrapper-functions.js";
import sqlite3 from "sqlite3";
import path from "node:path";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import 'dotenv/config';

const SECRET_KEY = process.env["SECRET_KEY"];
const ACCESS_KEY = process.env["ACCESS_SECRET"];
const REFRESH_KEY = process.env["REFRESH_SECRET"];
const SALT_ROUND = 10;

export async function handleUserRegistration (req, res) {
    let { username, password, secret } = req.body;
    if (!username || !password) return res.sendStatus(401);

    const salt = bcrypt.genSaltSync(SALT_ROUND);
    password = bcrypt.hashSync(password, salt);

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
        res.status(500).json({message: "Error connecting to database"});
    } finally {
        db.close();
    };
};

export async function handleUserLogin (req, res) {

    const { username, password } = req.body;
    if (!username || !password) return res.sendStatus(401);

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        SELECT * FROM users
            WHERE username = ?
    `;

    const changeRefreshTokenSql = `
        UPDATE users
            SET refresh_token = ?
            WHERE username = ?
    `;

    try {
        const foundUser = await fetchAll(db, sql, [username]);
        const pwdMatch = bcrypt.compareSync(password, foundUser?.password || "");
        if (!pwdMatch || foundUser.length === 0) return res.sendStatus(401); 

        const accessToken = jwt.sign(
            {
                username: foundUser.username,
                roles: JSON.parse(foundUser.roles)
            },
            ACCESS_KEY,
            { expiresIn: "10s" }
        );

        const refreshToken = jwt.sign(
            {
                username: foundUser.username
            },  
            REFRESH_KEY,
            { expiresIn : "30s" }
        );

        await execute(db, changeRefreshTokenSql, [refreshToken, foundUser.username]);
       
        res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: "30s"});
        res.json({
            accessToken,
            roles: JSON.parse(foundUser.roles)
        });
        
    } catch (error) {
        res.status(500).json({message: "Cannot connect to DB"});
    } finally {
        db.close();
    }
};