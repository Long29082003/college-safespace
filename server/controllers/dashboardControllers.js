import { fetchAll } from "../database/wrapper-functions.js";
import sqlite3 from "sqlite3";
import path from "node:path";
import { sortedCounts } from "../utils/util_functions.js";

export async function handlePostSummarization (req, res) {

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        SELECT * FROM posts
            ORDER BY created_at DESC
    `;

    try {
        const posts = await fetchAll(db, sql);

        let counts = {};
        counts.hasOwn
        posts.forEach(post => {
            const emotionsList = JSON.parse(post.feelings);
            emotionsList.forEach(emotion => {
                if (counts.hasOwnProperty(emotion)) {
                    counts[emotion]++;
                } else {
                    counts[emotion] = 1;
                };
            });
        });
        sortedCounts(counts);

        res.json({
            "total_post": posts.length,
            "posts": {...posts}
        })
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error in fetching data from database"});
    } finally {
        db.close();
    };
};