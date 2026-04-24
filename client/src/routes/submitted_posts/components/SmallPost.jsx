//Todo Display postInfo information
//Todo Adding the tag and untag function for posts
//Todo Display all information on the right column

import { useState, useRef } from "react";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate.js";
import clsx from "clsx";

import "../styles/SmallPost.css";

import { FaFlag } from "react-icons/fa";


export function SmallPost ({postInfo, setSubmittedPosts, displayedPost, setDisplayedPost, setPopUpMessage, setPopUpClick}) {
    const axiosPrivate = useAxiosPrivate();
    //? States
    const [ isHovered, setIsHovered ] = useState(false);
    const [ isClosed, setIsClosed ] = useState(false);

    //? Reference
    const smallPostRef = useRef(null);

    let { id, name, recipient, feelings, message, created_at } = postInfo;

    if (created_at) {
        const timeStamp = new Date(created_at);
        created_at = timeStamp.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    message = message.length >= 50 ? message.slice(0, 51) + " ..." : message;

    const handleClick = () => {
        if (displayedPost?.id === id) setDisplayedPost(null);
        else {
            setDisplayedPost({...postInfo});
        };
    };

    const handleFlagClick = () => {
        const sendFlagPostRequest = async (id) => {
            try {
                const response = await axiosPrivate.post("/api/admin/flag-submitted-post", { id });
                console.log(response.data);
                const { id: returnedId } = response.data.id;
                await new Promise(resolve => setTimeout(resolve, 1000));
                setSubmittedPosts(prev => {
                    const filter = prev.filter(post => post.id !== returnedId);
                    return filter;
                });
            } catch (error) {
                console.log(error);
                if (!error?.response) setPopUpMessage("Error: Cannot connect to server");
                else if (error.response?.status === 401) setPopUpMessage("Error: Cannot authorize request");
                else if (error.reponse?.status === 403) setPopUpMessage("Error: User does not have the credential");
                else if (error.response?.status === 500) setPopUpMessage("Error: Internal server error"); 
            };
        };

        const smallPost = smallPostRef.current;
        const styles = {
            transform: "translateX(-400px)",
            opacity: 0
        };

        Object.assign(smallPost.style, styles);
        setPopUpMessage("Post Flagged");
        setPopUpClick(prev => prev + 1);
        setDisplayedPost(null);
        setIsClosed(true);

        sendFlagPostRequest(id);
    };

    return (
        <div 
            className= {clsx("post-in-submitted-posts", isHovered ? "hovered" : null, isClosed ? "closed" : null)}
            onMouseEnter = {() => setIsHovered(true)}
            onMouseLeave = {() => setIsHovered(false)}
            ref = {smallPostRef}
        >
            <div className="move-box">
                <div className="click-area" onClick = {handleClick}></div>
                <div className="time">{created_at}</div>
                <div className="name"><span>Sender: </span>{name}</div>
                <div className="recipient"><span>To: </span>{recipient}</div>
                <div className="content">{message}</div>
                <div className="flag-container" onClick = {handleFlagClick}>
                    <FaFlag id = "flag-icon" />
                </div>
            </div>
        </div>
    )
};