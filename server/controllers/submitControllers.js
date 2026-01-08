import { getDbConnection } from "../database/getDbConnection.js";

export async function handlePostSubmit (req, res) {

    let {name, recipient, feelings, message} = req.body;
    console.log(name, recipient, feelings, message);
    name = name.trim();
    recipient = recipient.trim();
    message = message.trim();
    if (!name) name = "Anonymous";
    if (!recipient) recipient = "The multiverse";

    const db = await getDbConnection();
    await db.run(`INSERT INTO posts 
                (name, recipient, feelings, message) 
                VALUES (?, ?, ?, ?)
            `, [name, recipient, feelings, message]);
    await db.close();

    res.json({message: "data received succesfully"})

};