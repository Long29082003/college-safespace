//Todo: Work on joining table at the back end to fetch post and their reactions at the sasme time ✅
//Todo: Remove button when already fetch all posts ✅
//Todo: Change loading state when load posts ✅
//Todo: Disabled button when loading new post ✅
//Todo: Fix the bug that display the wrong date
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

import "../../styles/moreposts-screen-styles/moreposts.css";

import { PostInMorePost } from "./postInMorePost.jsx";
import { Button } from "../button.jsx";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function MorePosts () {
    //? States
    const [ posts, setPosts ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    //? Reference
    const earliestTime = useRef("");
    const latestTime = useRef("");
    const latestId = useRef("");
    const reachEndDb = useRef(false);

    const fetchMorePostsScreenData = async () => {
        try {
            const postsResult = await fetch(`/api/dashboard/postwithreactions?earliest_time=${earliestTime.current && earliestTime.current.toISOString()}&latest_time=${latestTime.current && latestTime.current.toISOString()}&latest_id=${latestId.current}`);
            const data = await postsResult.json();

            await new Promise(resolve => setTimeout(resolve, 700));
            setLoading(false);
            
            earliestTime.current = earliestTime.current > new Date(data["earliest_time"]) ? earliestTime.current : new Date(data["earliest_time"]);
            latestTime.current = new Date(data["latest_time"]);
            latestId.current = data["latest_id"];
            if (data["latest_id"] === 1) reachEndDb.current = true;
            setPosts(prev => [...prev, ...data["reaction_added_posts"]]);
        } catch (error) {
            console.log("Cannot connect to the server");
        };
    };
    
    useEffect(() => {
        setLoading(true);
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
        setLoading(true);
        fetchMorePostsScreenData();
    };

    return (
        <div className="more-posts">
            <h1>Posts</h1>
            <div className="posts-container">
                {posts.length > 0 ? displayPosts() : null}
            </div>
            {reachEndDb.current === false ? 
            <div className={clsx("loading-container", loading && "loading")}>
                <Button 
                    id = "load-more-button" 
                    hoverEffect = {false}
                    callback = {handleLoadMoreButtonClick}    
                >Load more posts</Button>
                {loading && 
                <DotLottieReact
                    src="lottie-animation/more-posts-loading-animation.lottie"
                    loop
                    autoplay
                    style={{width: 500, height: 200, transform: "translateY(-30px) scale(1.1)"}}
                />}
            </div> : <h1 className = "notification">All posts fetched</h1>}
        </div>
    );
};