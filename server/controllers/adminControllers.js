import sqlite3 from "sqlite3";
import { fetchAll, execute } from "../database/wrapper-functions.js";
import path from "node:path";

import { convertUTCStringToDbTime, convertDbTimeToUTCString } from "../utils/util_functions.js";

export const handleGetSubmittedPosts = async (req, res) => {
    
    const db = new sqlite3.Database(path.join("database", "database.db"));

    let { limit, earliest_time, latest_time, latest_id } = req.query;

    if (!limit) limit = 10;
    else limit = Number(limit);
    
    if (earliest_time) {
        earliest_time = convertUTCStringToDbTime(earliest_time);
        latest_time = convertUTCStringToDbTime(latest_time);
    };

    if (latest_id) latest_id = Number(latest_id);

    const isFirstFetch = !earliest_time && !latest_time && !latest_id;
    let submittedPosts;
    let status;

    try {
        if (isFirstFetch) {
            submittedPosts = await fetchAll(db, `
                    SELECT *
                    FROM submitted_posts
                        ORDER BY created_at DESC, id DESC
                        LIMIT ?
                `, [limit]);
        } else {
            submittedPosts = await fetchAll(db, `
                    SELECT *
                    FROM submitted_posts
                        WHERE created_at > ?
                        OR (created_at = ? AND id < ?)
                        OR created_at < ?
                        ORDER BY created_at DESC, id DESC
                        LIMIT ? 
                `, [earliest_time, latest_time, latest_id, latest_time, limit]);
        };
    } catch (error) {
        res.sendStatus(500);
    }

    db.close();

    if (submittedPosts.length > 0) {
        status = "normal";
        submittedPosts = submittedPosts.map(post => {
            return {
                ...post,
                "created_at": convertDbTimeToUTCString(post["created_at"])
            };
        });

        const newEarliestTime = submittedPosts[0]["created_at"]
        const newLatestTime = submittedPosts[submittedPosts.length - 1]["created_at"]
        const newLatestId = submittedPosts[submittedPosts.length - 1]["id"];
        res.json({
            status,
            submittedPosts,
            new_earliest_time: newEarliestTime,
            new_latest_time: newLatestTime,
            new_latest_id: newLatestId
        });
    } else {
        status = "no-post";
        res.json({status});
    };
};

export const handleFlagSubmittedPost = async (req, res) => {
    const { id } = req.body;

    const sql = `
        UPDATE submitted_posts
            SET flagged = CASE 
                WHEN flagged = 0 THEN 1
                WHEN flagged = 1 THEN 0
                ELSE flagged = 0
                END
            WHERE id = ?;
    `;

    const db = new sqlite3.Database(path.join("database", "database.db"));

    try {
        await execute(db, sql, [id]);
        res.json({ id });
    } catch (error) {
        console.log(error);
        return res.sendStatus(501);
    } finally {
        db.close();
    }
};