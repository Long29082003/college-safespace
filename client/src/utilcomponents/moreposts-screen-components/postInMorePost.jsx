import { useState } from "react";

import "../../styles/moreposts-screen-styles/postinmoreposts.css";
import { feelingsColors } from "../feelingchips.js";

export function PostInMorePost ({postInfo}) {
    //? States
    let { id, name, recipient, feelings, message, created_at } = postInfo;
    const [ isPostHover, setIsPostHover ] = useState(false);

    const timeStamp = new Date(created_at);
    const formattedDate = timeStamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
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

    return (
        <div className="post-in-more-posts" onMouseEnter = {() => setIsPostHover(true)} onMouseLeave = {() => setIsPostHover(false)}>
            <div className="container" style = {isPostHover ? backgroundColorStyle : null}>
                <div className="header">
                    <div className="persons">
                        <div className="name">From {name}</div>
                        <div className="recipient">To {recipient}</div>
                    </div>
                    <div className="time">{formattedDate}</div>
                </div>
                <div className="message" style = {isPostHover ? textColorStyle : null} >{message}</div>
            </div>
        </div>
    )
};