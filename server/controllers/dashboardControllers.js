import { fetchAll } from "../database/wrapper-functions.js";
import sqlite3 from "sqlite3";
import path from "node:path";
import { sortedCounts, convertUTCStringToDbTime, convertDbTimeToUTCString } from "../utils/util_functions.js";

import { countPostOnMonth, returnStringOfIds } from "../utils/util_functions.js";

export async function handlePostSummarization (req, res) {

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const sql = `
        SELECT * FROM posts
            ORDER BY created_at DESC
    `;

    try {
        const posts = await fetchAll(db, sql);

        let counts = {};
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

        const postCountForEachMonth = countPostOnMonth(posts);

        res.json({
            "total-post": posts.length,
            "feeling-categories-count": sortedFeelingCategoriesCount,
            "posts": posts,
            "post-count-for-each-month": postCountForEachMonth
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

export async function handleCommentSummarization (req, res) {

    const db = new sqlite3.Database(path.join("database", "database.db"));

    const commentsGroupedByPostSql = `
        SELECT post_id, COUNT(id) as comment_count
        FROM comments
        GROUP BY post_id
        ORDER BY comment_count DESC
    `;

    const allCommentsSql = `
        SELECT COUNT(id) as total FROM comments
    `;

    try {
        const [ commentsGroupedByPost, allComments ] = await Promise.all([fetchAll(db, commentsGroupedByPostSql), fetchAll(db, allCommentsSql)]);
        if (allComments[0]["total"] === 0) res.json({
                                                mostCommentedPost: {
                                                    post_id: null,
                                                    comment_count: "N/A"
                                                },
                                                total: 0
                                            });
        else res.json({
            mostCommentedPost: commentsGroupedByPost[0],
            total: allComments[0]["total"]
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({message: "Cannot connect to database"});
    } finally {
        db.close();
    };
};

export async function handleGetPostForMorePostsScreen (req, res) {

    const db = new sqlite3.Database(path.join("database", "database.db"));

    let { earliest_time, latest_time, latest_id } = req.query;

    const isFirstFetch = !earliest_time || !latest_time || !latest_id;
    let sql;
    let posts;

    try {
        if (isFirstFetch) {
            sql = `
                SELECT * FROM posts
                    ORDER BY created_at DESC
                    LIMIT 10
            `;
            posts = await fetchAll(db, sql);
        } else {
            earliest_time = convertUTCStringToDbTime(earliest_time);
            latest_time = convertUTCStringToDbTime(latest_time);
            latest_id = Number(latest_id);
            sql = `
                SELECT * FROM posts
                    WHERE created_at > ?
                    OR (created_at = ? AND id < ?)
                    OR created_at < ?
                    ORDER BY created_at DESC, id DESC
                    LIMIT 10
            `
            posts = await fetchAll(db, sql, [earliest_time, latest_time, latest_id, latest_time])
        };

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
            earliest_time: convertDbTimeToUTCString(newEarliestTime),
            latest_time: convertDbTimeToUTCString(newLatestTime),
            latest_id: newLatestId,
            reaction_added_posts: reactionsAddedPosts
        });

    } catch (error) {
        console.log("Error connecting to db");
        res.status(501).json({message: "Cannot connect to database"})
    }

};