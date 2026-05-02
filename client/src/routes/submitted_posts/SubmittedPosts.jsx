import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAxiosPrivate } from "../../hooks/useAxiosPrivate.js";

import { SmallPost } from "./components/SmallPost.jsx";
import { ExpandedPost } from "./components/ExpandedPost.jsx";

import clsx from "clsx";

import { RiResetRightFill } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { FaRegTrashCan } from "react-icons/fa6";
import "./SubmittedPosts.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function SubmittedPostsPage () {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    //? States
    const [ displayFlaggedPosts, setDisplayFlaggedPosts ] = useState(false);
    const [ submittedPosts, setSubmittedPosts ] = useState([]);
    const [ displayedPost, setDisplayedPost ] = useState(null);
    const [ isSmallPostsLoading, setIsSmallPostsLoading ] = useState(false);

    //? These two go together
    const [ popUpMessage, setPopUpMessage ] = useState(null);
    const [ popUpClick, setPopUpClick ] = useState(0);

    //? Reference used in fetching data
    const popUpReference = useRef(null);
    const earliestPostTime = useRef("");
    const latestPostTime = useRef("");
    const latestPostId = useRef("");

    //? Derived state
    const isErrorPopUp = popUpMessage?.slice(0, 5).toLowerCase() === "error" ? true : false;

    const fetchSubmittedPosts = async (limit) => {
        try {
            const response = await axiosPrivate.get(`/api/admin/submitted-posts?limit=${limit}&earliest_time=${earliestPostTime.current && earliestPostTime.current.toISOString() || ""}&latest_time=${latestPostTime.current && latestPostTime.current.toISOString() || ""}&latest_id=${latestPostId.current}`);
            const data = response.data;

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));

            if (data.status === "normal") {
                const newEarliestTime = new Date(data["new_earliest_time"]);
                earliestPostTime.current = !earliestPostTime.current || newEarliestTime > earliestPostTime.current ? newEarliestTime : earliestPostTime.current;
                latestPostTime.current = new Date(data["new_latest_time"]);
                latestPostId.current = data["new_latest_id"];
                setSubmittedPosts(prev => [...prev, ...data.submittedPosts]);
            } else if (data.status == "no-post") {
                setSubmittedPosts(prev => prev);
            };
        } catch (error) {
            if (!error?.response) {
                setPopUpMessage("Error: Connection error");
                setPopUpClick(prev => prev + 1);
                setIsSmallPostsLoading(false);
            } else if (error.response?.status === 404) {
                setPopUpMessage("Error 404: Not found");
                setPopUpClick(prev => prev + 1);
            } else if (error.response?.status === 403) {
                setPopUpMessage("Error 403: Not authenticated");
                setPopUpClick(prev => prev + 1);
                navigate("/login", { state: {from: location}, replace: true});
            } else if (error.response?.status === 401) {
                setPopUpMessage("Error 401: Not authorized");
                setPopUpClick(prev => prev + 1);
            } else if (error.response?.status === 500) {
                setPopUpMessage("Error 500: Unknown Error");
                setPopUpClick(prev => prev + 1);
            } else {
                setPopUpMessage("Error: Unknown");
                setPopUpClick(prev => prev + 1);
            };
        } finally {
            setIsSmallPostsLoading(false);
        };
    };  

    const fetchFlaggedSubmittedPosts = async (limit) => {
        try {
            const response = await axiosPrivate.get(`/api/admin/flagged-submitted-posts?limit=${limit}&earliest_time=${earliestPostTime.current && earliestPostTime.current.toISOString() || ""}&latest_time=${latestPostTime.current && latestPostTime.current.toISOString() || ""}&latest_id=${latestPostId.current}`);
            const data = response.data;

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));

            if (data.status === "normal") {
                const newEarliestTime = new Date(data["new_earliest_time"]);
                earliestPostTime.current = !earliestPostTime.current || newEarliestTime > earliestPostTime.current ? newEarliestTime : earliestPostTime.current;
                latestPostTime.current = new Date(data["new_latest_time"]);
                latestPostId.current = data["new_latest_id"];
                setSubmittedPosts(prev => [...prev, ...data.submittedPosts]);
            } else {
                setSubmittedPosts(prev => prev);
            };
        } catch (error) {
            if (!error?.response) {
                setPopUpMessage("Error: Connection error");
                setPopUpClick(prev => prev + 1);
                setIsSmallPostsLoading(false);
            } else if (error.response?.status === 404) {
                setPopUpMessage("Error 404: Not found");
                setPopUpClick(prev => prev + 1);
            } else if (error.response?.status === 403) {
                setPopUpMessage("Error 403: Not authenticated");
                setPopUpClick(prev => prev + 1);
                navigate("/login", { state: {from: location}, replace: true});
            } else if (error.response?.status === 401) {
                setPopUpMessage("Error 401: Not authorized");
                setPopUpClick(prev => prev + 1);
            } else if (error.response?.status === 500) {
                setPopUpMessage("Error 500: Unknown Error");
                setPopUpClick(prev => prev + 1);
            } else {
                setPopUpMessage("Error: Unknown");
                setPopUpClick(prev => prev + 1);
            };
        } finally {
            setIsSmallPostsLoading(false);
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
                { bottom: "100px", opacity: 1, offset: 0.7 },
                { bottom: "100px", opacity: 0, offset: 1}
            ],
            { duration: 3500, fill: "forwards", easing: "ease" }
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
        if (displayFlaggedPosts === true) {
            setDisplayFlaggedPosts(false); 
            setSubmittedPosts([]); 
            setIsSmallPostsLoading(true);
            earliestPostTime.current = "";
            latestPostTime.current = "";
            latestPostId.current = "";
            fetchSubmittedPosts(10);
        };
    };

    const handleFlaggedPostsClicked = () => {
        if (displayFlaggedPosts === false) {
            setDisplayFlaggedPosts(true);
            setSubmittedPosts([]);
            setIsSmallPostsLoading(true);
            earliestPostTime.current = "";
            latestPostTime.current = "";
            latestPostId.current = "";
            fetchFlaggedSubmittedPosts(10);
        };
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
                            : isSmallPostsLoading ? <DotLottieReact
                                                      src="/lottie-animation/Insider-loading.lottie"
                                                      loop
                                                      autoplay
                                                      style = {{ height: "150px" }}
                                                  /> 
                                                :<span className = "no-post-notification">No submitted posts</span>}
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

            {popUpMessage ? 
            <div 
                className="pop-up" 
                ref = {popUpReference}
                style = {isErrorPopUp ? {backgroundColor: "rgb(251, 222, 222)", color: "black"} : null}
            >{popUpMessage}</div> 
            : null}
        </div>
    )
};