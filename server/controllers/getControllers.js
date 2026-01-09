import { getDbConnection } from "../database/getDbConnection.js";

export const handleGetPosts = async (req, res) => {
    
    let {limit} = req.query;

    if (!limit) limit = 10;

    const db = await getDbConnection();
    const data = await db.all(
        `
            SELECT * FROM posts
                LIMIT ?
        `, [limit]
    );
    
    res.json(data);

};