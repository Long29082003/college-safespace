//Todo Creating a emotion dashboard for emotions
import { useState, useContext, useEffect } from "react";
import { States } from "../App.jsx";

import "../styles/morepostsscreen.css";
import { Button } from "../utilcomponents/button.jsx";
import { MorePosts } from "../utilcomponents/moreposts-screen-components/moreposts.jsx";
import { Dashboard } from "../utilcomponents/moreposts-screen-components/dashboard.jsx";

import clsx from "clsx";

export function MorePostsScreen () {
    //? States
    const states = useContext(States);
    const [ contentToDisplay, setContentToDisplay ] = useState("posts");

    const handleDisplayPosts = () => {
        if (contentToDisplay === "posts") return;

        setContentToDisplay("posts");
    };

    const handleDisplaySummary = () => {
        if (contentToDisplay === "summary") return;
    
        setContentToDisplay("summary");
    };

    const handleEnterDashboard = () => {
        states.setAppStates(true, false, "more-posts-screen");
    };

    const handleExit = () => {
        states.setAppStates(false, true, null);
        setTimeout(() => setContentToDisplay("posts"), 1000);
    };
    
    return (
        <div className="more-posts-screen">
            <div className="nav-bar">
                <p 
                    className={clsx({"nav": true, "choosen": contentToDisplay === "posts"})} 
                    onClick = {handleDisplayPosts}>Posts</p>
                <p 
                className={clsx({"nav": true, "choosen": contentToDisplay === "summary"})} 
                onClick = {handleDisplaySummary}>Summary</p>
                <Button id = "exit-button" callback = {handleExit}>X</Button>
            </div>

            <div className="content-container">
                {contentToDisplay === "summary" ? <Dashboard /> : <MorePosts/>}
            </div>
            
            <Button id = "enter-button" hoverEffect = {false} callback = {handleEnterDashboard}>See more posts</Button>

        </div>
    )
};