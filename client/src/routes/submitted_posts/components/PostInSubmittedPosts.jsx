//Todo Display postInfo information
//Todo Adding the tag and untag function for posts
//Todo Display all information on the right column

import { useState } from "react";

import clsx from "clsx";

import "../styles/PostInSubmittedPosts.css";

import { FaFlag } from "react-icons/fa";

export function PostInSubmittedPosts ({postInfo}) {
    const [ isHovered, setIsHovered ] = useState(false);

    return (
        <div 
            className= {clsx("post-in-submitted-posts", isHovered ? "hovered" : null)}
            onMouseEnter = {() => setIsHovered(true)}
            onMouseLeave = {() => setIsHovered(false)}
        >
            <div className="time">04-18-2026</div>
            <div className="name"><span>Sender: </span>Long</div>
            <div className="recipient"><span>To: </span>Doan</div>
            <div className="content">Hello World!</div>
            <FaFlag id = "flag-icon" />
        </div>
    )
};