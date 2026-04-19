import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { PostInSubmittedPosts } from "./components/PostInSubmittedPosts";

import clsx from "clsx";

import { RiResetRightFill } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import "./SubmittedPosts.css";

export function SubmittedPostsPage () {
    //? States
    const [ displayFlaggedPosts, setDisplayFlaggedPosts ] = useState(false);
    const [ submittedPosts, setSubmittedPosts ] = useState([]);

    //? Reference used in fetching data
    const earliestPostTime = useRef("");
    const latestPostTime = useRef("");
    const latestPostId = useRef("");
    const reachEndDB = useRef(false);

    const fetchSubmittedPosts = async (limit) => {
        const response = await fetch(`/api/admin/submitted-posts?limit=${limit}&earliest_time=${earliestPostTime.current && earliestPostTime.current.toISOString() || ""}&latest_time=${latestPostTime.current && latestPostTime.current.toISOString() || ""}&latest_id=${latestPostId.current}`);
        if (response.ok) {
            const data = await response.json();
            if (data.status === "normal") {
                const newEarliestTime = new Date(data["new_earliest_time"]);
                earliestPostTime.current = !earliestPostTime.current || newEarliestTime > earliestPostTime.current ? newEarliestTime : earliestPostTime.current;
                latestPostTime.current = new Date(data["new_latest_time"]);
                latestPostId.current = data["new_latest_id"];
                if (data["new_latest_id"] === 1) reachEndDB.current = true;
                setSubmittedPosts(prev => [...prev, ...data.submittedPosts]);
            } else {
                setSubmittedPosts([]);
            };
        } else {
            console.log("Internal server error!");
        };
    };  

    useEffect(() => {
        fetchSubmittedPosts(10);
    }, []);

    const displayPostInSubmittedPosts = () =>  {
        return submittedPosts.map(post => {
            return <PostInSubmittedPosts
                        postInfo = {{...post}}
                        key = {post.id}
                   />
        });
    };

    const handleAllPostsClicked = () => {
        if (displayFlaggedPosts === true) setDisplayFlaggedPosts(false);
    };

    const handleFlaggedPostsClicked = () => {
        if (displayFlaggedPosts === false) setDisplayFlaggedPosts(true);
    };

    return (
        <div className="submitted-posts-page">
            <Link to = "/admin">Back to Admin</Link>
            <div className="container">
                <div className="column-1">
                    <div className="utils">
                        <RiResetRightFill className = "icon"/>
                        <BiSortAlt2 className = "icon"/>
                    </div>
                    <div className="filter-by-category">
                        <span 
                            className = {clsx("to-all-posts", !displayFlaggedPosts && "choosen")} 
                            onClick = {handleAllPostsClicked}
                        >All</span>
                        <span 
                            className = {clsx("to-flagged-posts", displayFlaggedPosts && "choosen")}
                            onClick = {handleFlaggedPostsClicked}
                        >Flagged</span>
                    </div>
                    <div className="submitted-posts-container"
                        style = {submittedPosts.length === 0 ? {justifyContent: "center", alignItems: "center"} : {}}
                    >
                        {submittedPosts.length > 0 ? 
                            displayPostInSubmittedPosts()
                            : <span className = "no-post-notification">No submitted posts</span>}
                    </div>
                </div>
                <div className="column-2">
                    <div className="utils"></div>
                    <div className="display"></div>
                </div>
            </div>
        </div>
    )
};