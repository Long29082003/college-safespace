import { useState } from "react";

import clsx from "clsx";

import { FaCog } from "react-icons/fa";

import "../styles/controlpanel.css";

export function ControlPanel () {
    const [ isPanelToPostsHovered, setIsPanelToPostsHovered ] = useState(false);

    return (
        <div className="control-panel">
            <div 
                className={clsx("panel-to-posts", "column-1", isPanelToPostsHovered && "hovered")}
                onMouseEnter = {() => {setIsPanelToPostsHovered(true)}}
                onMouseLeave = {() => {setIsPanelToPostsHovered(false)}} 
            >
                <h3>Posts</h3>
                <div className="decors">
                    <div className = "decor post-1">
                        <div className="post-head">
                            <h2 className="name">AM</h2>
                            <p className="date">XX-XX-XXXX</p>
                        </div>
                        <p className="feeling">
                            <span>Trusting</span>
                        </p> 
                        <div className = "message">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. 
                            Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. 
                            Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
                        </div>
                    </div>
                    <div className = "decor post-2">
                        <div className="post-head">
                            <h2 className="name">PP</h2>
                            <p className="date">XX-XX-XXXX</p>
                        </div>
                        <p className="feeling">
                            <span>Loved</span>
                        </p> 
                        <div className = "message">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. 
                            Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. 
                            Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
                        </div>
                    </div>
                    <div className = "decor post-3">
                        <div className="post-head">
                            <h2 className="name">LD</h2>
                            <p className="date">XX-XX-XXXX</p>
                        </div>
                        <p className="feeling">
                            <span>Happy</span>
                        </p> 
                        <div className = "message">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. 
                            Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. 
                            Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
                        </div>
                    </div>
                    <div className = "decor post-4">
                        <div className="post-head">
                            <h2 className="name">VI</h2>
                            <p className="date">XX-XX-XXXX</p>
                        </div>
                        <p className="feeling">
                            <span>Inspired</span>
                        </p> 
                        <div className = "message">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. 
                            Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. 
                            Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
                        </div>
                    </div>
                    <div className = "decor post-5">
                        <div className="post-head">
                            <h2 className="name">BH</h2>
                            <p className="date">XX-XX-XXXX</p>
                        </div>
                        <p className="feeling">
                            <span>Motivated</span>
                        </p> 
                        <div className = "message">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. 
                            Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. 
                            Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
                        </div>
                    </div>
                </div>

                <div className="background"></div>
            </div>

            <div className="panel-to-submitted-posts"><h3>Submitted Posts</h3></div>
            <div className="panel-to-post-settings"><FaCog id = "cog-icon"/><h3>Posts Settings</h3></div>
        </div>
    )
};