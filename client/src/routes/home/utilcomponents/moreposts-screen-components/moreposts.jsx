//Todo: Work on joining table at the back end to fetch post and their reactions at the sasme time ✅
//Todo: Remove button when already fetch all posts ✅
//Todo: Change loading state when load posts ✅
//Todo: Disabled button when loading new post ✅
//Todo: Set up filter functionality using <select> <option> ✅
//Todo: Finish the back end for default filter and anonymous filter ✅
//Todo: Fix the bug that display the wrong date ✅
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
    const filterState = useRef("default");
    const earliestTime = useRef("");
    const latestTime = useRef("");
    const latestId = useRef("");
    const randomSeed = useRef(Math.floor(Math.random() * 1000) + 1);
    const reachEndDb = useRef(false);

    const fetchMorePostsScreenData = async () => {
        try {
            const postsResult = await fetch(`/api/dashboard/postwithreactions?filter_state=${filterState.current}&earliest_time=${earliestTime.current && earliestTime.current.toISOString()}&latest_time=${latestTime.current && latestTime.current.toISOString()}&latest_id=${latestId.current}&random_seed=${randomSeed.current}`);
            const data = await postsResult.json();
            console.log(data);

            await new Promise(resolve => setTimeout(resolve, 700));
            setLoading(false);
            
            //? This is to convert all the UTC date into
            const reactionsAddedPostsWithFormattedDate = data["reaction_added_posts"].map(post => {
                return {
                    ...post,
                    created_at: new Date(post.created_at)
                };
            });
            earliestTime.current = earliestTime.current > new Date(data["earliest_time"]) ? earliestTime.current : new Date(data["earliest_time"]);
            latestTime.current = new Date(data["latest_time"]);
            latestId.current = data["latest_id"];
            reachEndDb.current = data["reach_end_db"];
            setPosts(prev => [...prev, ...reactionsAddedPostsWithFormattedDate]);
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

    const handleFilterClick = (filter) => {
        filterState.current = filter;
        earliestTime.current = "";
        latestTime.current = "";
        latestId.current = "";
        setPosts([]);
        setLoading(true);
        fetchMorePostsScreenData();
    };

    const handleLoadMoreButtonClick = () => {
        setLoading(true);
        fetchMorePostsScreenData();
    };

    return (
        <div className="more-posts">
            <div className="header">
                <h1>Posts</h1>
                <div className="utils-bar">
                    <select name="select-filter">
                        <button>
                            <selectedcontent></selectedcontent>
                        </button>

                        <option value="sort-by-time" onClick = {() => handleFilterClick("default")}>Newest to oldest</option>
                        <option value="sort-by-anonymous" onClick = {() => handleFilterClick("anonymous_filter")}>Anonymous</option>
                        <option value="randomized-sort" onClick = {() => handleFilterClick("randomized_filter")}>Randomized</option>
                    </select>
                </div>
            </div>
            <div className="posts-container">
                {posts.length > 0 ? displayPosts() : null}
            </div>
            <div className={clsx("loading-container", loading && "loading")}>
                {reachEndDb.current === false ? 
                <Button 
                    id = "load-more-button" 
                    hoverEffect = {false}
                    callback = {handleLoadMoreButtonClick}    
                >Load more posts</Button>
                : <h1 className = "notification">All posts fetched</h1>}
                {loading && 
                <DotLottieReact
                    src="lottie-animation/more-posts-loading-animation.lottie"
                    loop
                    autoplay
                    style={{width: 500, height: 200, transform: "translateY(-30px) scale(1.1)"}}
                />}
            </div> 
        </div>
    );
};