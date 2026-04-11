//Todo: Handle case where username match with existing users ✅
//Todo: Handling CORS issues ✅
//Todo: Make refreshToken cookie expires sooner and see what's up
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
    if (!username || !password) return res.sendStatus(400);

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

        await execute(db, sql, [username, password, JSON.stringify(roles)]);
        res.status(201).json({message: "Account receive succesfully"});
    } catch (error) {
        res.status(500).json({message: "Error connecting to database"});
    } finally {
        db.close();
    };
};

export async function handleUserLogin (req, res) {

    const { username, password, persistLogin } = req.body;
    if (!username || !password) return res.sendStatus(400);
    console.log(persistLogin);

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
        const userData = foundUser[0];
        const pwdMatch = bcrypt.compareSync(password, userData?.password || "");

        if (!pwdMatch || foundUser.length === 0) return res.sendStatus(401); 

        const accessToken = jwt.sign(
            {
                username: userData.username,
                roles: JSON.parse(userData.roles)
            },
            ACCESS_KEY,
            { expiresIn: "15s" }
        );

        const refreshToken = jwt.sign(
            {
                username: userData.username,
                persist: persistLogin
            },  
            REFRESH_KEY,
            { expiresIn : "10m" }
        );

        await execute(db, changeRefreshTokenSql, [refreshToken, userData.username]);
       
        //? Send session-cookie when user dont want persistLogin, send normal cookie when user want persistlogin 
        if (persistLogin) res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: 10 * 60 * 1000, sameSite: "Lax", secure: false});
        else res.cookie("jwt", refreshToken, {httpOnly: true, sameSite: "Lax", secure: false});

        res.json({
            accessToken,
            roles: JSON.parse(userData.roles),
            user: userData.username,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Cannot connect to DB"});
    } finally {
        db.close();
    }
};

export async function handleRefreshToken (req, res) {
    const cookies = req.cookies;
    const returnedRefreshToken = cookies["jwt"];
    if (!returnedRefreshToken) return res.sendStatus(401);

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `SELECT username, roles FROM users
                    WHERE refresh_token = ?
    `;

    try {
        const result = await fetchAll(db, sql, [returnedRefreshToken]);
        const foundUser = result[0];
        if (!foundUser?.username) return res.sendStatus(403);

        jwt.verify(
            returnedRefreshToken, 
            REFRESH_KEY
            , (error, decoded) => {
                //? Add another error handling in case refreshToken expires
                if (error || decoded?.username !== foundUser.username) return res.sendStatus(403);
                const userRoles = JSON.parse(foundUser.roles);

                const newAccessToken = jwt.sign(
                    {
                        username: decoded.username
                    },
                    ACCESS_KEY,
                    { expiresIn: "15s"}
                );

                return res.json({newAccessToken, roles: userRoles});
            }
        )

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    } finally {
        db.close();
    }
};