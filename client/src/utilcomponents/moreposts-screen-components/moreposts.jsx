//Todo: Work on joining table at the back end to fetch post and their reactions at the sasme time ✅
//Todo: Disabled button when loading new post
//Todo: Remove button when already fetch all posts
import { useState, useEffect, useRef } from "react";

import "../../styles/moreposts-screen-styles/moreposts.css";

import { PostInMorePost } from "./postInMorePost.jsx";
import { Button } from "../button.jsx";

export function MorePosts () {
    //? States
    const [ posts, setPosts ] = useState([]);

    //? Reference
    const earliestTime = useRef("");
    const latestTime = useRef("");
    const latestId = useRef("");
    const reachEndDb = useRef(false);

    const fetchMorePostsScreenData = async () => {
        try {
            const postsResult = await fetch(`/api/dashboard/postwithreactions?earliest_time=${earliestTime.current && earliestTime.current.toISOString()}&latest_time=${latestTime.current && latestTime.current.toISOString()}&latest_id=${latestId.current}`);
            const data = await postsResult.json();
            console.log(data);
            earliestTime.current = earliestTime.current > new Date(data["earliest_time"]) ? earliestTime.current : new Date(data["earliest_time"]);
            latestTime.current = new Date(data["latest_time"]);
            latestId.current = data["latest_id"];
            setPosts(prev => [...prev, ...data["reaction_added_posts"]]);
        } catch (error) {
            console.log("Cannot connect to the server");
        };
    };
    
    useEffect(() => {
        fetchMorePostsScreenData();
    }, []);

    const displayPosts = () => {
        return posts.map(post => {
            return (
                <PostInMorePost
                    postInfo = {{...post}}
                />
            )
        });
    };

    const handleLoadMoreButtonClick = () => {
        fetchMorePostsScreenData();
    };

    return (
        <div className="more-posts">
            <h1>Posts</h1>
            <div className="posts-container">
                {posts.length > 0 ? displayPosts() : null}
            </div>
            <Button 
                id = "load-more-button" 
                hoverEffect = {false}
                callback = {handleLoadMoreButtonClick}    
            >Load more posts</Button>
        </div>
    );
};