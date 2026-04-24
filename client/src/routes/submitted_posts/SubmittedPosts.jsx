import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAxiosPrivate } from "../../hooks/useAxiosPrivate.js";

import { SmallPost } from "./components/SmallPost.jsx";
import { ExpandedPost } from "./components/ExpandedPost.jsx";

import clsx from "clsx";

import { RiResetRightFill } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { FaRegTrashCan } from "react-icons/fa6";
import "./SubmittedPosts.css";

export function SubmittedPostsPage () {
    const axiosPrivate = useAxiosPrivate();
    //? States
    const [ displayFlaggedPosts, setDisplayFlaggedPosts ] = useState(false);
    const [ submittedPosts, setSubmittedPosts ] = useState([]);
    const [ displayedPost, setDisplayedPost ] = useState(null);

    //? These two go together
    const [ popUpMessage, setPopUpMessage ] = useState(null);
    const [ popUpClick, setPopUpClick ] = useState(0);

    //? Reference used in fetching data
    const popUpReference = useRef(null);
    const earliestPostTime = useRef("");
    const latestPostTime = useRef("");
    const latestPostId = useRef("");
    const reachEndDB = useRef(false);

    const fetchSubmittedPosts = async (limit) => {
        const response = await axiosPrivate.get(`/api/admin/submitted-posts?limit=${limit}&earliest_time=${earliestPostTime.current && earliestPostTime.current.toISOString() || ""}&latest_time=${latestPostTime.current && latestPostTime.current.toISOString() || ""}&latest_id=${latestPostId.current}`);
        if (response.statusText === "OK") {
            const data = response.data;
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

    //? Set up a pop up whenever popUpMessage and popUpCLick change
    useEffect(() => {
        if (!popUpMessage) return;
        const popUp = popUpReference.current;
        popUp.animate(
            [   
                { bottom: "80px", opacity: 0, offset: 0},
                { bottom: "100px", opacity: 1, offset: 0.1 },
                { bottom: "100px", opacity: 1, offset: 0.6 },
                { bottom: "100px", opacity: 0, offset: 1}
            ],
            { duration: 2000, fill: "forwards", easing: "ease" }
        )
        
    }, [popUpClick]);

    const displayPostInSubmittedPosts = () =>  {
        return submittedPosts.map(post => {
            return <SmallPost
                        postInfo = {{...post}}
                        setSubmittedPosts = {setSubmittedPosts}
                        displayedPost = {displayedPost}
                        setDisplayedPost = {setDisplayedPost}
                        setPopUpMessage = {setPopUpMessage}
                        setPopUpClick = {setPopUpClick}
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
                    {displayedPost !== null ? 
                    <div className="utils">
                        <div className="reject-button">Delete<FaRegTrashCan id = "trash-can-icon"/></div>
                        <div className="accept-button">Accept<span>✅</span></div>
                    </div>: null}
                    <div className="display">
                        {displayedPost !== null ? 
                        <ExpandedPost 
                            displayedPostInfo = {displayedPost}
                            setDisplayedPost = {setDisplayedPost}
                        /> : 
                        <div className = "no-displayed-post">
                            <HiArchiveBoxXMark />
                            <span>No displayed post</span>
                        </div>}
                    </div>
                </div>
            </div>

            {popUpMessage ? <div className="pop-up" ref = {popUpReference}>{popUpMessage}</div> : null}
        </div>
    )
};