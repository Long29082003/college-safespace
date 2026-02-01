import sqlite3 from "sqlite3";
import { fetchAll } from "../database/wrapper-functions.js";
import path from "node:path"

import { convertUTCStringToDbTime, convertDbTimeToUTCString } from "../utils/util_functions.js";

export const handleGetPosts = async (req, res) => {
    
    const db = new sqlite3.Database(path.join("database", "database.db"));

    let { limit, earliest_time, latest_time, latest_id } = req.query;

    if (!limit) limit = 10;
    else limit = Number(limit);
    
    if (earliest_time) {
        earliest_time = convertUTCStringToDbTime(earliest_time);
        latest_time = convertUTCStringToDbTime(latest_time);
    };
    if (latest_id) latest_id = Number(latest_id);

    // console.log("Limit: ", limit);
    // console.log("Earliest time: ", typeof(earliest_time), earliest_time);
    // console.log("Latest time: ", typeof(latest_time), latest_time);
    // console.log("Latest id: ", typeof(latest_id), latest_id);

    const isFirstFetch = !earliest_time && !latest_time && !latest_id;
    let posts;

    if (isFirstFetch) {
        console.log("is first fetch");
        posts = await fetchAll(db, `
                SELECT *
                FROM posts
                    ORDER BY created_at DESC, id DESC
                    LIMIT ?
            `, [limit]);
    } else {
        console.log("not first fetch");
        posts = await fetchAll(db, `
                SELECT *
                FROM posts
                    WHERE created_at > ?
                    OR (created_at = ? AND id < ?)
                    OR created_at < ?
                    ORDER BY created_at DESC, id DESC
                    LIMIT ? 
            `, [earliest_time, latest_time, latest_id, latest_time, limit]);
        console.log(posts);
    };
//2026-01-11 01:26:29.000
//2026-01-11 01:26:29
    db.close();

    posts = posts.map(post => {
        return {
            ...post,
            "created_at": convertDbTimeToUTCString(post["created_at"])
        };
    });

    const newEarliestTime = posts[0]["created_at"]
    const newLatestTime = posts[posts.length - 1]["created_at"]
    const newLatestId = posts[posts.length - 1]["id"];

    res.json({
        posts,
        new_earliest_time: newEarliestTime,
        new_latest_time: newLatestTime,
        new_latest_id: newLatestId
    });
};

export const handleGetRandomPosts = async (req, res) => {
    const db = new sqlite3.Database(path.join("database", "database.db"));

    let { earliest_time, limit } = req.query;

    earliest_time = convertUTCStringToDbTime(earliest_time);

    let posts = await fetchAll(db, `
            WITH recent AS (
                SELECT * 
                FROM posts
                WHERE created_at > ?
                ORDER BY created_at DESC
                LIMIT ?
            ), fill AS (
                SELECT *
                FROM posts
                WHERE created_at <= ?
                AND id NOT IN (SELECT id FROM recent)
                ORDER BY RANDOM()
                LIMIT (10 - (SELECT COUNT(*) FROM recent))
            )
            SELECT * FROM recent
            UNION
            SELECT * FROM fill
            ORDER BY created_at DESC;
        `, [earliest_time, limit, earliest_time]
    );

    db.close();

    posts = posts.map(post => {
        return {
            ...post,
            "created_at": convertDbTimeToUTCString(post["created_at"])
        };
    });

    const newEarliestTime = posts[0]["created_at"];

    res.json({
        posts,
        new_earliest_time: newEarliestTime
    });
};

export const handleGetComments = async (req, res) => {

    const { post_id } = req.query;

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        SELECT * FROM comments
            WHERE post_id = ?
    `;

    let comments = await fetchAll(db, sql, [Number(post_id)]);

    db.close();

    comments = comments.map(comment => {
        return {
            ...comment,
            "created_at": convertDbTimeToUTCString(comment["created_at"])
        }
    })

    res.json(comments);
};

export const handleGetReactions = async (req, res) => {

    const { post_id } = req.query;

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        SELECT type, COUNT(id) as number_of_reactions
            FROM reactions
            WHERE post_id = ?
            GROUP BY type
    `

    try {
        const result = await fetchAll(db, sql, [post_id]);
        res.json(result);
    } catch (error) {
        console.log("Failed to connect to database");
        res.status(501).json({message: "Cannot connect to database"});
    } finally {
        db.close();
    };
};