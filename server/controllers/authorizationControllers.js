import path from "node:path";
import sqlite3 from "sqlite3";
import { execute, fetchAll } from "../database/wrapper-functions.js";

import jwt from "jsonwebtoken";
import 'dotenv/config';

const REFRESH_KEY = process.env["REFRESH_SECRET"];

export async function handleLogout (req, res) {
    const cookies = req.cookies;
    const returnedRefreshToken = cookies["jwt"];
    if (!returnedRefreshToken) return res.sendStatus(204);

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const findSql = `
        SELECT refresh_token from users
            WHERE username = ?
    `;

    const sql = `
        UPDATE users
            SET refresh_token = null
            WHERE refresh_token = ?
    `;

    jwt.verify(
        returnedRefreshToken, 
        REFRESH_KEY, 
        async (error, decoded) => {
            //? Send session-cookie when user dont want persistLogin, send normal cookie when user want persistlogin 
            if (decoded.persist) res.clearCookie("jwt", {httpOnly: true, maxAge: 10 * 60 * 1000, sameSite: "Lax", secure: false});
            else res.clearCookie("jwt", {httpOnly: true, sameSite: "Lax", secure: false});

            if (error) return res.sendStatus(204);
   
            try {
                const result = await fetchAll(db, findSql, [decoded.username]);
                const foundUser = result[0];
                if (!foundUser || foundUser?.refresh_token !== returnedRefreshToken) return res.sendStatus(200);

                await execute(db, sql, [returnedRefreshToken]);
                return res.json({message: "Log out successfully"});
            } catch (error) {
                return res.sendStatus(400);
            } finally {
                db.close();
            };
    });
};