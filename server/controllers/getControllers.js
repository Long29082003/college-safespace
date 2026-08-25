import sqlite3 from "sqlite3";
import { fetchAll } from "../database/wrapper-functions.js";
import path from "node:path"

import { fillerMotivationalMsg, convertUTCStringToDbTime, convertDbTimeToUTCString } from "../utils/util_functions.js";
import { returnStringOfIds } from "../utils/util_functions.js";

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

    const isFirstFetch = !earliest_time && !latest_time && !latest_id;
    let posts;

    if (isFirstFetch) {
        posts = await fetchAll(db, `
                SELECT *
                FROM posts
                    ORDER BY created_at DESC, id DESC
                    LIMIT ?
            `, [limit]);
    } else {
        posts = await fetchAll(db, `
                SELECT *
                FROM posts
                    WHERE created_at > ?
                    OR (created_at = ? AND id < ?)
                    OR created_at < ?
                    ORDER BY created_at DESC, id DESC
                    LIMIT ? 
            `, [earliest_time, latest_time, latest_id, latest_time, limit]);
    };

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

export const handleGetCampfireMsg = async (req, res) => {

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        SELECT * from campfire
    `;

    try {
        const message = await fetchAll(db, sql);
        let data = [];

        if (message.length === 0) data = [...fillerMotivationalMsg];
        else data = [...message, ...fillerMotivationalMsg];

        res.json({"campfire-message": data});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error: Cannot connect to database"});
    };

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



const sqlBasedOnFilter = {
    default: {
        "first-fetch-sql": `
            SELECT * FROM posts
                ORDER BY created_at DESC
                LIMIT 10
        `,
        "subsequent-fetch-sql": `
            SELECT * FROM posts
                WHERE created_at > ?
                OR (created_at = ? AND id < ?)
                OR created_at < ?
                ORDER BY created_at DESC, id DESC
                LIMIT 10
        `
    },
    anonymous_filter: {
        "first-fetch-sql": `
            SELECT * FROM posts
                WHERE name = "Anonymous"
                ORDER BY created_at DESC
                LIMIT 10
        `,
        "subsequent-fetch-sql": `
            SELECT * FROM posts
                WHERE name = "Anonymous" AND (created_at > ?
                OR (created_at = ? AND id < ?)
                OR created_at < ?)
                ORDER BY created_at DESC, id DESC
                LIMIT 10
        `
    },
    randomized_filter: {
        "first-fetch-sql": `
            SELECT * FROM posts
                ORDER BY ((id + ?) * 1103515245 + 12345) % 2147483648
                LIMIT 10
        `,
        "subsequent-fetch-sql": `
        WITH ordered AS (
            SELECT *,
                ROW_NUMBER() OVER (
                ORDER BY ((id + ?) * 1103515245 + 12345) % 2147483648
                ) AS rn
            FROM posts
            )
            SELECT *
            FROM ordered
            WHERE rn > (SELECT rn FROM ordered WHERE id = ?)
            LIMIT 10;
        `
    }

}

export async function handleGetPostWithReactions (req, res) {

    const db = new sqlite3.Database(path.join("database", "database.db"));

    let { filter_state, earliest_time, latest_time, latest_id, random_seed } = req.query;

    const sqlSet = sqlBasedOnFilter[filter_state];
    const isFirstFetch = !earliest_time || !latest_time || !latest_id;
    let sql;
    let posts;

    try {
        if (isFirstFetch) {
            sql = sqlSet["first-fetch-sql"];

            if (filter_state === "default" || filter_state === "anonymous_filter") posts = await fetchAll(db, sql);
            else if (filter_state === "randomized_filter") posts = await fetchAll(db, sql, [random_seed]);
        } else {
            earliest_time = convertUTCStringToDbTime(earliest_time);
            latest_time = convertUTCStringToDbTime(latest_time);
            latest_id = Number(latest_id);
            sql = sqlSet["subsequent-fetch-sql"];

            if (filter_state === "default" || filter_state === "anonymous_filter") posts = await fetchAll(db, sql, [earliest_time, latest_time, latest_id, latest_time]);
            else if (filter_state === "randomized_filter") posts = await fetchAll(db, sql, [random_seed, latest_id]);
        };
        //? Convert the date in DB format to UTC formate for all posts in posts
        posts.forEach((post, index) => {posts[index].created_at = convertDbTimeToUTCString(post.created_at)});

        const newEarliestTime = posts[0]["created_at"]
        const newLatestTime = posts[posts.length - 1]["created_at"]
        const newLatestId = posts[posts.length - 1]["id"];

        const listOfIds = posts.map(post => post.id);
        
        const postsReactionSql = `
                SELECT post_id, COUNT(id) as reactions_count
                FROM reactions
                WHERE reactions.post_id IN (${returnStringOfIds(listOfIds)})
                GROUP BY post_id
            `
        
        const postsReaction = await fetchAll(db, postsReactionSql);
        const reactionsAddedPosts = posts.map(post => {
            const count = postsReaction.find(postHasReaction => postHasReaction.post_id === post.id) && 
                            postsReaction.find(postHasReaction => postHasReaction.post_id === post.id)["reactions_count"]
                            || 0;

            return {
                ...post,
                reaction_count: count
            };
        });
        res.json({
            earliest_time: newEarliestTime,
            latest_time: newLatestTime,
            latest_id: newLatestId,
            reach_end_db: reactionsAddedPosts.length < 10,
            reaction_added_posts: reactionsAddedPosts,
        });

    } catch (error) {
        console.log("Error when connect to db");
        console.log(error);
        res.status(501).json({message: "Cannot connect to database"})
    }

};