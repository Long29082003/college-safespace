import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAxiosPrivate } from "../../hooks/useAxiosPrivate.js";

import { SmallPost } from "./components/SmallPost.jsx";
import { ExpandedPost } from "./components/ExpandedPost.jsx";

import clsx from "clsx";

import { FaXmark } from "react-icons/fa6";
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

    //? These two go together
    const [ displayPopupWindow, setDisplayPopupWindow ] = useState(false);
    const [ isDeleteOrApprove, setIsDeleteOrApprove ] = useState(null);

    //? State for delete or approve loading
    const [ isProceedLoading, setIsProceedLoading ] = useState(false);
    const [ displaySuccessfulProceed, setDisplaySuccessfulProceed ] = useState({state: false, message: null});

    //? State to display error when request fails in column-2 utils
    const [ requestFailedMessage, setRequestFailedMessage ] = useState(null);
    const [ isRequestFailedMsgOut, setIsRequestFailedMsgOut ] = useState(false);

    //? Reference used in fetching data
    const popUpReference = useRef(null);
    const earliestPostTime = useRef("");
    const latestPostTime = useRef("");
    const latestPostId = useRef("");

    //? Derived state
    const isErrorPopUp = popUpMessage?.slice(0, 5).toLowerCase() === "error" ? true : false;

    const fetchSubmittedPosts = async (limit, controller) => {
        try {
            const response = await axiosPrivate.get(`/api/admin/submitted-posts`,
                                                { 
                                                    params: {
                                                        limit: limit,
                                                        earliest_time: earliestPostTime.current && earliestPostTime.current.toISOString() || "",
                                                        latest_time: latestPostTime.current && latestPostTime.current.toISOString() || "",
                                                        latest_id: latestPostId.current
                                                    },
                                                    signal: controller.signal 
                                                });
            const data = response.data;

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

    const fetchFlaggedSubmittedPosts = async (limit, controller) => {
        try {
            const response = await axiosPrivate.get(`/api/admin/flagged-submitted-posts`,
                                                { 
                                                    params: {
                                                        limit: limit,
                                                        earliest_time: earliestPostTime.current && earliestPostTime.current.toISOString() || "",
                                                        latest_time: latestPostTime.current && latestPostTime.current.toISOString() || "",
                                                        latest_id: latestPostId.current
                                                    },
                                                    signal: controller.signal 
                                                });
            const data = response.data;

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

    const approveSubmittedPost = async () => {
        setIsDeleteOrApprove(null);
        const { id, name, recipient, feelings, message } = displayedPost;
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const response = await axiosPrivate.post("/api/admin/approve-submitted-post", {
                                                            id,
                                                            name,
                                                            recipient,
                                                            feelings,
                                                            message
                                                    });
            const data = response.data;
            setDisplayedPost(null);
            setSubmittedPosts(prev => prev.filter(post => post.id !== data.id));
            setDisplaySuccessfulProceed({state: true, message: "Post approved!"});
        } catch (error) {
            if (!error.response) {
                setPopUpMessage("Error: Server does not response");
                setRequestFailedMessage(`Cannot complete action. Internet connection issue`);
                setIsRequestFailedMsgOut(true);
            } else if (error.response?.status === 400) {
                setPopUpMessage("Error: Bad request");
                setRequestFailedMessage(`Cannot complete action. Error code: ${error.response?.status}`);
                setIsRequestFailedMsgOut(true);
            } else {
                setPopUpMessage("Error: Something went wrong");
                setRequestFailedMessage(`Cannot complete action. Error code: ${error.response?.status}`);
                setIsRequestFailedMsgOut(true);
            };
        } finally {
            setIsProceedLoading(false);
        };
    };

    const deleteSubmittedPost = async () => {
        setIsDeleteOrApprove(null);
        const { id, name, recipient, feelings, message } = displayedPost;
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await axiosPrivate.post("/api/admin/delete-submitted-post", {
                                                            id
                                                    });
            const data = response.data;
            setDisplayedPost(null);
            setSubmittedPosts(prev => prev.filter(post => post.id !== data.id));
            setDisplaySuccessfulProceed({state: true, message: "Post deleted!"});
        } catch (error) {
            if (!error.response) {
                setPopUpMessage("Error: Server does not response");
                setRequestFailedMessage(`Cannot complete action. Internet connection issue`);
                setIsRequestFailedMsgOut(true);
            } else if (error.response?.status === 400) {
                setPopUpMessage("Error: Bad request");
                setRequestFailedMessage(`Cannot complete action. Error code: ${error.response?.status}`);
                setIsRequestFailedMsgOut(true);
            } else {
                setPopUpMessage("Error: Something went wrong");
                setRequestFailedMessage(`Cannot complete action. Error code: ${error.response?.status}`);
                setIsRequestFailedMsgOut(true);
            };
        } finally {
            setIsProceedLoading(false);
        };
    };

    useEffect(() => {
        fetchSubmittedPosts(10);
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        if (displayFlaggedPosts === false) fetchSubmittedPosts(10, controller);
        else if (displayFlaggedPosts === true) fetchFlaggedSubmittedPosts(10, controller);

        return () => {
            controller.abort();
        };
    }, [displayFlaggedPosts]);

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
                        displayFlaggedPosts = {displayFlaggedPosts}
                        postInfo = {{...post}}
                        setSubmittedPosts = {setSubmittedPosts}
                        displayedPost = {displayedPost}
                        setDisplayedPost = {setDisplayedPost}
                        setPopUpMessage = {setPopUpMessage}
                        setPopUpClick = {setPopUpClick}
                        setIsRequestFailedMsgOut = {setIsRequestFailedMsgOut}
                        setDisplaySuccessfulProceed = {setDisplaySuccessfulProceed}
                        key = {post.id}
                   />
        });
    };

    const displayPopupWindowMessage = () => {
        if (isDeleteOrApprove === "delete") return "This post will be deleted permanently. Do you want to proceed?";
        else if (isDeleteOrApprove === "approve") return "This post will be displayed on page. Do you want to proceed?";
        else return "Do you want to proceed?";
    };

    const displayPopupWindowProceedButtonText = () => {
        if (isDeleteOrApprove === "delete") return "Delete";
        else if (isDeleteOrApprove === "approve") return "Approve";
        else return "Proceed";      
    };

    const handleAllPostsClicked = () => {
        if (displayFlaggedPosts === true) {
            setDisplayFlaggedPosts(false); 
            setSubmittedPosts([]);
            setIsSmallPostsLoading(true);
            earliestPostTime.current = "";
            latestPostTime.current = "";
            latestPostId.current = "";
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
        };
    };

    const handleApproveButtonClick = () => {
        setDisplayPopupWindow(true);
        setIsDeleteOrApprove("approve");
    };

    const handleDeleteButtonClick = () => {
        setDisplayPopupWindow(true);
        setIsDeleteOrApprove("delete");
    };

    const handlePopupWindowExit = () => {
        setDisplayPopupWindow(false);
        setIsDeleteOrApprove(null);
    };

    const handlePopupWindowProceedButtonClick = () => {
        setDisplayPopupWindow(false);
        setIsProceedLoading(true);
        if (isDeleteOrApprove === "delete") deleteSubmittedPost();
        else if (isDeleteOrApprove === "approve") approveSubmittedPost();
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
                        <div className="reject-button" onClick = {handleDeleteButtonClick}>Delete<FaRegTrashCan id = "trash-can-icon"/></div>
                        <div className="accept-button" onClick = {handleApproveButtonClick}>Accept<span>✅</span></div>
                    </div>: null}

                    {displayedPost !== null ?
                    <div 
                        className = {clsx("request-failed-message", isRequestFailedMsgOut ? "out" : "in")}
                        onClick = {() => setIsRequestFailedMsgOut(false)}
                    >
                        {requestFailedMessage}
                    </div> : null }

                    <div className="display">
                        {displayedPost !== null ? 
                        <ExpandedPost 
                            displayedPostInfo = {displayedPost}
                            isProceedLoading = {isProceedLoading}
                            setDisplayedPost = {setDisplayedPost}
                            setDisplayPopupWindow = {setDisplayPopupWindow}
                            setIsDeleteOrApprove = {setIsDeleteOrApprove}
                            setIsRequestFailedMsgOut = {setIsRequestFailedMsgOut}
                            setDisplaySuccessfulProceed = {setDisplaySuccessfulProceed}
                        /> : 
                        <div className = "no-displayed-post">
                            {displaySuccessfulProceed.state ? 
                                <span style = {{color: "black"}}>{displaySuccessfulProceed.message}</span>
                                : <>
                                      <HiArchiveBoxXMark />
                                      <span>No displayed post</span>
                                  </>}
                        </div>
                        }
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

            {displayPopupWindow ? 
            <div className="popup-window">
                <div className="interact-popup">
                    <div className="icon-container"><FaXmark className = "exit-icon" onClick = {handlePopupWindowExit}/></div>
                    <div className="notification">{displayPopupWindowMessage()}</div>
                    <div className="buttons-container">
                        <button id = "cancel-button" type = "button" onClick = {handlePopupWindowExit}>Cancel</button>
                        <button 
                            id = "proceed-button" 
                            type = "button"
                            style = {isDeleteOrApprove === "delete" ? 
                                {
                                    backgroundColor: "rgb(251, 104, 104)",
                                    color: "white",
                                    fontWeight: "bold"
                                } : {
                                    backgroundColor: "var(--main-color)",
                                    color: "white"
                                }
                            }
                            onClick = {handlePopupWindowProceedButtonClick}
                        >{displayPopupWindowProceedButtonText()}</button>
                    </div>
                </div>
                <div className="background"></div>
            </div> : null}
        </div>
    )
};