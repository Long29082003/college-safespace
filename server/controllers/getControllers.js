import { getDbConnection } from "../database/getDbConnection.js";

export const handleGetPosts = async (req, res) => {
    
    const db = await getDbConnection();

    let { limit, earliest_time, latest_time, latest_id } = req.query;

    if (!limit) limit = 10;
    else limit = Number(limit);
    
    if (latest_id) latest_id = Number(latest_id);

    console.log("Limit: ", limit);
    console.log("Earliest time: ", typeof(earliest_time), earliest_time);
    console.log("Latest time: ", typeof(latest_time), latest_time);
    console.log("Latest id: ", typeof(latest_id), latest_id);

    const isFirstFetch = !earliest_time && !latest_time && !latest_id;
    let posts;

    if (isFirstFetch) {
        console.log("is first fetch");
        posts = await db.all(
            `
                SELECT *
                FROM posts
                    ORDER BY created_at DESC, id DESC
                    LIMIT ?
            `, [limit]
        );
    } else {
        console.log("not first fetch");
        posts = await db.all(
            `
                SELECT * FROM posts
                    WHERE created_at > ?
                    OR (created_at = ? AND id < ?)
                    OR created_at < ?
                    ORDER BY created_at DESC, id DESC
                    LIMIT ? 
            `, [earliest_time, latest_time, latest_id, latest_time, limit]
        );
    };

    const newEarliestTime = posts[0]["created_at"];
    const newLatestTime = posts[posts.length - 1]["created_at"];
    const newLatestId = posts[posts.length - 1]["id"];

    res.json({
        posts,
        new_earliest_time: newEarliestTime,
        new_latest_time: newLatestTime,
        new_latest_id: newLatestId
    });
};