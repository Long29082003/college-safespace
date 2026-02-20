//Todo: Work on joining table at the back end to fetch post and their reactions at the sasme time ✅
//Todo: Remove button when already fetch all posts ✅
//Todo: Change loading state when load posts ✅
//Todo: Disabled button when loading new post ✅
//Todo: Set up filter functionality using <select> <option> ✅
//Todo: Finish the back end for default filter and anonymous filter ✅
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
    const filterState = useRef("default");
    const earliestTime = useRef("");
    const latestTime = useRef("");
    const latestId = useRef("");
    const reachEndDb = useRef(false);

    const fetchMorePostsScreenData = async () => {
        try {
            const postsResult = await fetch(`/api/dashboard/postwithreactions?filter_state=${filterState.current}&earliest_time=${earliestTime.current && earliestTime.current.toISOString()}&latest_time=${latestTime.current && latestTime.current.toISOString()}&latest_id=${latestId.current}`);
            const data = await postsResult.json();

            await new Promise(resolve => setTimeout(resolve, 700));
            setLoading(false);
            
            earliestTime.current = earliestTime.current > new Date(data["earliest_time"]) ? earliestTime.current : new Date(data["earliest_time"]);
            latestTime.current = new Date(data["latest_time"]);
            latestId.current = data["latest_id"];
            reachEndDb.current = data["reach_end_db"];
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

    const handleFilterClick = (filter) => {
        filterState.current = filter;
        earliestTime.current = "";
        latestTime.current = "";
        latestId.current = "";
        setLoading(true);
        setPosts([]);
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
                        <option value="sort-by-react">Most reacted</option>
                        <option value="randomized-sort">Randomized</option>
                    </select>
                </div>
            </div>
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