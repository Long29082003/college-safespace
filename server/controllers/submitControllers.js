import { getDbConnection } from "../database/getDbConnection.js";
import sqlite3 from "sqlite3";
import { execute } from "../database/wrapper-functions.js";
import path from "node:path";

export async function handlePostSubmit (req, res) {

    let {name, recipient, feelings, message} = req.body;
    console.log(name, recipient, feelings, message);
    name = name.trim();
    recipient = recipient.trim();
    message = message.trim();
    if (!name) name = "Anonymous";
    if (!recipient) recipient = "The multiverse";

    // const db = await getDbConnection();
    // await db.run(`INSERT INTO posts 
    //             (name, recipient, feelings, message) 
    //             VALUES (?, ?, ?, ?)
    //         `, [name, recipient, JSON.stringify(feelings), message]);
    // await db.close();
    const db = new sqlite3.Database(path.join("database", "database.db"));
    const sql = `INSERT INTO posts 
                (name, recipient, feelings, message) 
                VALUES (?, ?, ?, ?)
            `;
    await execute(db, sql, [name, recipient, JSON.stringify(feelings), message]);
    db.close();

    res.json({message: "data received succesfully"})

};


export async function handleCommentSubmit (req, res) {

    const { commentText, commentorName } = req.body;
    console.log(commentText, commentorName);

};