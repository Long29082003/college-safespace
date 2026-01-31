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
        const sortedFeelingCategoriesCount = sortedCounts(counts);

        res.json({
            "total-post": posts.length,
            "feeling-categories-count": sortedFeelingCategoriesCount,
            "posts": {...posts}
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Error in fetching data from database"});
    } finally {
        db.close();
    };
};

export async function handleReactionSummarization (req, res) {

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const reactionsByPostSql = `
        SELECT post_id, COUNT(id) as reaction_number
        FROM reactions
        GROUP BY post_id
        ORDER BY reaction_number DESC
    `;

    const reactionsByCategorySql = `
        SELECT type, COUNT(id) as type_number
        FROM reactions
        GROUP BY type
        ORDER BY type_number DESC
    `;

    try {
        const [reactionsByPost, reactionsByCategory] = await Promise.all([fetchAll(db, reactionsByPostSql), fetchAll(db, reactionsByCategorySql)]);
        if (reactionsByPost.length === 0 || reactionsByCategory.length === 0) res.json({
                                                                                            mostReactedPost: {post_id: null, reaction_number: "N/A"},
                                                                                            reactionsByType: {
                                                                                                "like": "N/A",
                                                                                                "love": "N/A",
                                                                                            }
                                                                                        });
        else res.json({
                    mostReactedPost: reactionsByPost[0],
                    reactionsByType: {
                        "like": reactionsByCategory.find(category => category.type === "like")["type_number"] || 0,
                        "love": reactionsByCategory.find(category => category.type === "love")["type_number"] || 0
                    }
                });
        
    } catch (error) {
        console.log("There has been an error connecting to database: ", error);
        res.status(501).json({message: "Error connecting to database"});
    } finally {
        db.close();
    };

};