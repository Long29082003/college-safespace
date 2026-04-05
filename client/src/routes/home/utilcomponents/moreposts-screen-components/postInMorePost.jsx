import { useState, useContext, useRef } from "react";

import "../../styles/moreposts-screen-styles/postinmoreposts.css";
import { feelingsColors } from "../feelingchips.js";

import clsx from "clsx";

import { States } from "../../Home.jsx";

export function PostInMorePost ({postInfo, displayFormat}) {
    //? States
    const states = useContext(States);
    let { id, name, recipient, feelings, message, created_at, reaction_count } = postInfo;
    const [ isPostHover, setIsPostHover ] = useState(false);

    const largeMasonryPost = displayFormat === "flex" && message.length > 200 ? true : false; 
    const timeStamp = new Date(created_at);
    const formattedDate = timeStamp.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    const formattedTime = timeStamp.toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
    
    feelings = JSON.parse(feelings);

    let bgColor;
    let textColor;
    const firstFeelingColors = feelingsColors.find(feeling => feeling.feeling === feelings[0]);
    if (!firstFeelingColors) {
        bgColor = "rgb(220, 239, 249)";
        textColor = "black";
    } else {
        bgColor = firstFeelingColors.bgColor;
        textColor = firstFeelingColors.textColor;
    };

    const backgroundColorStyle = { backgroundColor: bgColor};
    const textColorStyle = { "color": textColor, "fontWeight": 500};

    const displayPost = () => {
        if (displayFormat === "default") {
            return (
                <div className="post-in-more-posts-default"
                    onMouseEnter = {() => setIsPostHover(true)} 
                    onMouseLeave = {() => setIsPostHover(false)}
                >
                    <div className="time-and-info">
                        <div className="time-and-reaction-container">
                            <div className="time-date">{formattedDate}</div>
                            <div className="time-hour-min">{formattedTime}</div>

                            <div className="reaction-count">
                                <div className="small-reactions">
                                    <div className="like-icon"></div>
                                    <div className="love-icon"></div>
                                </div>
                                <p className="count">{reaction_count}</p>
                            </div>
                        </div>
                    </div> 
                    <div className="container" 
                        style = {isPostHover ? backgroundColorStyle : null}
                        onClick = {handlePostOnClick}
                    >
                        <div className="header">
                            <div className="persons">
                                <div className="name">From {name}</div>
                                <div className="recipient">To {recipient}</div>
                            </div>
                        </div>
                        <div className="message" style = {isPostHover ? textColorStyle : null} >{message}</div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className= {clsx("post-in-more-posts-mansory", largeMasonryPost ? "large-masonry" : null)}
                    onMouseEnter = {() => setIsPostHover(true)} 
                    onMouseLeave = {() => setIsPostHover(false)}
                    style = {backgroundColorStyle}
                    onClick = {handlePostOnClick}
                > 
                    <div className="header">
                        <div className="persons">
                            <div className="name">{name}</div>
                            <div className="recipient">To {recipient}</div>
                        </div>
                        <div className="time-date">{formattedDate}</div>
                    </div>
                    <div className="message" style = {isPostHover ? textColorStyle : null} >{message}</div>
                </div>
            )
        }
    };

    const handlePostOnClick = () => {
        states.setAppStates(true, false, "post-screen-from-more-posts", {
                                                        id: postInfo.id,
                                                        name: postInfo.name,
                                                        recipient: postInfo.recipient,
                                                        feelings: postInfo.feelings,
                                                        message: postInfo.message,
                                                        created_at: postInfo.created_at
                                                    })
    };

    return (
        <>
            {displayPost()}
        </>
        
    )
};