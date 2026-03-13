import { useState, useEffect } from "react";
import { FeelingCategoryChart } from "./feelingcategorychart.jsx";
import { PostTimelineChart } from "./posttimelinechart.jsx";

import "../../styles/moreposts-screen-styles/dashboard.css";

export function Dashboard () {
    //? States
    const [ postCountForEachMonth, setPostCountForEachMonth ] = useState(null);
    const [ totalPost, setTotalPost ] = useState("--");
    const [ feelingCategoriesCount, setFeelingCategoriesCount ] = useState(null);
    const [ reactionSummary, setReactionSummary ] = useState(null);
    const [ commentsSummary, setCommentsSummary ] = useState(null);

    //? Derived State:
    const totalReaction = reactionSummary && reactionSummary["reactionsByType"]["like"] && reactionSummary["reactionsByType"]["love"] ? 
                          reactionSummary["reactionsByType"]["like"] + reactionSummary["reactionsByType"]["love"] : "--";   
    const mostReactionCount = reactionSummary && reactionSummary["mostReactedPost"]["reaction_number"] || "--";   
    const likeReactionCount = reactionSummary && reactionSummary["reactionsByType"]["like"] || "--";
    const loveReactionCount = reactionSummary && reactionSummary["reactionsByType"]["love"] || "--";
    const totalComments = commentsSummary && commentsSummary["total"] || "--";
    const mostCommentCount = commentsSummary && commentsSummary["mostCommentedPost"]["comment_count"] || "--";

    //? Fetch Data 
    useEffect(() => {
        const loading = async () => {
            try {
                const [postsResult, reactionsResult, commentsResult ] = await Promise.all([
                    fetch("/api/dashboard/postinfo"), 
                    fetch("/api/dashboard/reactioninfo"),
                    fetch("/api/dashboard/commentinfo")
                ]);
                const postsData = await postsResult.json();
                const reactionsData = await reactionsResult.json();
                const commentsData =  await commentsResult.json();

                setPostCountForEachMonth(postsData["post-count-for-each-month"]);
                setTotalPost(postsData["total-post"]);
                setFeelingCategoriesCount(postsData["feeling-categories-count"]);
                setReactionSummary(reactionsData);
                setCommentsSummary(commentsData);
            } catch (error) {
                console.log("Cannot connect to the server");
            };
        };

        loading()
    }, [])

    return (
        <div className="dashboard">
            <h1>Summary</h1>
            <div className="stats">
                <div className="stats-container">
                    <div className="posts stat">
                        <div className="head">
                            <h2>Posts</h2>
                            <div className="total">
                                <span className = "count posts">{totalPost}</span>
                                <span className = "text">post(s)</span>
                            </div>
                        </div>
                        <div className="detail">
                        </div>
                    </div>
                    <div className="reactions stat">
                        <div className="head">
                            <h2>Reactions</h2>
                            <div className="total">
                                <span className = "count reactions">{totalReaction}</span>
                                <span className = "text">reaction(s)</span>
                            </div>
                        </div>
                        <div className="detail">
                            <div className="type-count">
                                <h3>Types</h3>
                                <div className="react-count">
                                    <div className = "like-icon-image"></div>
                                    <div className="count">{likeReactionCount}</div>
                                </div>
                                <div className="react-count">
                                    <div className = "love-icon-image"></div>
                                    <div className="count">{loveReactionCount}</div>
                                </div>
                            </div>
                            <div className="most-reacted-post-container">
                                <h3>Most react in a post</h3>
                                <p className="most-reacted-count">{mostReactionCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="comments stat">
                        <div className="head">
                            <h2>Comments</h2>
                            <div className="total">
                                <span className = "count comments">{totalComments}</span>
                                <span className = "text">comment(s)</span>
                            </div>
                        </div>
                        <div className="detail">
                            <div className="most-commented-post-container">
                                <h3>Most comments in a post</h3>
                                <p className="most-commented-count">{mostCommentCount}</p>
                            </div>
                        </div>
                    </div>  
                </div>
                <FeelingCategoryChart feelingCategoriesCount = {feelingCategoriesCount} />
                <PostTimelineChart postCountForEachMonth = {postCountForEachMonth} />
            </div>

            <div className="posts-display">
                <div className="utils"></div>
                <div className="posts"></div>
            </div>
        </div>
    )
};