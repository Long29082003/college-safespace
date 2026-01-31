//Todo Creating a emotion dashboard for emotions
import { useState, useContext, useEffect } from "react";
import { States } from "../App.jsx";

import "../styles/dashboardscreen.css";
import { Button } from "../utilcomponents/button.jsx";

import { FeelingCategoryChart } from "../utilcomponents/feelingcategorychart.jsx";
import { PostTimelineChart } from "../utilcomponents/posttimelinechart.jsx";

export function DashboardScreen () {
    //? States
    const states = useContext(States);
    const [ posts, setPosts ] = useState(null);
    const [ totalPost, setTotalPost ] = useState("--");
    const [ feelingCategoriesCount, setFeelingCategoriesCount ] = useState(null);
    // console.log(feelingCategoriesCount);

    //? Fetch Data 
    useEffect(() => {
        const loading = async () => {
            try {
                const result = await fetch("/api/dashboard/postinfo");
                const data = await result.json();
                setPosts(data["posts"]);
                setTotalPost(data["total-post"]);
                setFeelingCategoriesCount(data["feeling-categories-count"]);
            } catch (error) {
                console.log("Cannot connect to the server");
            };
        };

        loading()
    }, [])

    const handleEnterDashboard = () => {
        states.setAppStates(true, false, "dashboard-screen");
    };

    const handleExit = () => {
        states.setAppStates(false, true, null);
    };
    
    return (
        <div className="dashboard-screen">

            <div className="dashboard">
                <h1>Summary</h1>
                <div className="stats">
                    <div className="stats-container">
                        <div className="posts stat">
                            <div className="head">
                                <h2>Posts</h2>
                                <div className="total">
                                    <span className = "count posts">{totalPost}</span>
                                    <span className = "text">post(s)</span>
                                </div>
                            </div>
                            <div className="detail">
                            </div>
                        </div>
                        <div className="reactions stat">
                            <div className="head">
                                <h2>Reactions</h2>
                                <div className="total">
                                    <span className = "count reactions">100</span>
                                    <span className = "text">reaction(s)</span>
                                </div>
                            </div>
                            <div className="detail">
                                
                            </div>
                        </div>
                        <div className="comments stat">
                            <div className="head">
                                <h2>Comments</h2>
                                <div className="total">
                                    <span className = "count comments">30</span>
                                    <span className = "text">comment(s)</span>
                                </div>
                            </div>
                            <div className="detail">
                            </div>
                        </div>  
                    </div>
                    <FeelingCategoryChart feelingCategoriesCount = {feelingCategoriesCount}/>
                    <PostTimelineChart />
                </div>

                <div className="posts-display">
                    <div className="utils"></div>
                    <div className="posts"></div>
                </div>
            </div>
            
            <Button id = "enter-button" hoverEffect = {false} callback = {handleEnterDashboard}>See more posts</Button>

            <Button id = "exit-button" callback = {handleExit}>X</Button>
        </div>
    )
};