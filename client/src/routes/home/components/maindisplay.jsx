// Todo: Work on the titling of the .main-display. ✅
// Todo: Ask chatgpt about how to delete Post after aniamtion. ✅
// Todo: Create a submit button ✅
// Todo: Work on creating a form sequence ✅
// Todo: Create a simple backend to store the form data ✅
// Todo: try to fetch data from backend to the queue ✅
// Todo: when use tab out find a way to stop the spawning interval. Cant but I can reset them ✅
// Todo (next after initla fetch): confitional fetching when queue running low ✅
//! Todo: Important: change the date in the app to UTC so that it is congruent everywhere ✅ Basically done. Can clean up the code a little bit later
//! Problem: Dont know why when fetching all data in dataset it somehow rerun the cycle? Which is good but unexpected ✅ This is fixed by adding random fetch to prevent any unexpected behavior
// Todo: If fetch all the data already, then fetch but randomized. ✅
// Todo: Work on Inspiration page ✅
// Todo: Maybe watch video to see scroll animation ✅

// Todo: Test if whether putting the scene component in would work

// * The way the setTimeout work is that its like a ticking bomb. After the interval
// * the bomb will explode take one post from queue put it in animating list and becasue
// * the queue change the bomb is planted again. But if we just depends the setTimeout
// * on the change in queue then what happens if we fetch for more data from the database and add it to the queue?
import { createContext } from "react";
import "../styles/maindisplay.css";
import { FaUserAlt } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";
import { GrContact } from "react-icons/gr";
import { FaInfo } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";
import { GiCampfire } from "react-icons/gi";
import { v4 as uuidv4 } from "uuid"; 

import { Scene } from "./maindisplay-components/scene.jsx";

import { Button } from "../utilcomponents/button.jsx";
import { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { States } from "../Home.jsx";

import { useAuth } from "../../../hooks/useAuth.js";

import { tilting } from "../utilFunctions/utils.js";

const PostsState = createContext(null);

export function MainDisplay() {
    //? States passed from App level
    const { auth } = useAuth();

    const {setAppStates} = useContext(States);
    const [postsQueue, setPostsQueue] = useState([]);
    const [displayHint, setDisplayHint] = useState(true);
    
    //? Ref
    const accountBox = useRef(null);
    //* These following refs are anchors used to search the database
    const earliestPostTime = useRef("");
    const latestPostTime = useRef("");
    const latestPostId = useRef("");
    const reachEndDB = useRef(false);

    //? -----------------------useEffect-----------------------

    //* Fetch posts into queue after the queue run low
    useEffect(() => {
        async function fetchPosts (limit) {
            const respond = await fetch(`/api/get/post?limit=${limit}&earliest_time=${earliestPostTime.current && earliestPostTime.current.toISOString() || ""}&latest_time=${latestPostTime.current && latestPostTime.current.toISOString() || ""}&latest_id=${latestPostId.current}`);
            if (respond.ok) {
                const data = await respond.json();
                
                const newEarliestTime = new Date(data["new_earliest_time"]);
                earliestPostTime.current = !earliestPostTime.current || newEarliestTime > earliestPostTime.current ? newEarliestTime : earliestPostTime.current;
                latestPostTime.current = new Date(data["new_latest_time"]);
                latestPostId.current = data["new_latest_id"];
                if (data["new_latest_id"] === 1) reachEndDB.current = true;
                setPostsQueue(prev => [...prev, ...data.posts]);
            } else {
                console.log("Internal server error!");
            };
        };

        async function fetchRandomPosts (limit) {
            const respond = await fetch(`/api/get/random_post?limit=${limit}&earliest_time=${earliestPostTime.current}`);
            if (respond) {
                const data = await respond.json();
                console.log(`Fetch random posts: `, data.posts);
                
                const newEarliestTime = new Date(data["new_earliest_time"]);
                earliestPostTime.current = !earliestPostTime.current || newEarliestTime > earliestPostTime.current ? newEarliestTime : earliestPostTime.current;
                setPostsQueue(prev => [...prev, ...data.posts]);
            } else {
                console.log("Internal server error!");
            };
        }

        if (postsQueue.length <= 5) {
            if (!reachEndDB.current) fetchPosts(10);
            else if (reachEndDB.current) fetchRandomPosts(10);
        } else return;

        return () => {};
    }, [postsQueue]);

    const AccountBoxOnMouseEnter = () => {
        const { scrollHeight } = accountBox.current;
        accountBox.current.style.height = `${scrollHeight}px`;
    };

    const AccountBoxOnMouseLeave = () => {
        accountBox.current.style.height = `75px`;
    };

    return (
        <PostsState.Provider value = {{postsQueue, setPostsQueue}}>
            <div className="main-display" onClick = {() => setDisplayHint(false)}>

                <Scene />

                <div 
                    className="account-box" 
                    ref = {accountBox} 
                    onMouseEnter = {AccountBoxOnMouseEnter}
                    onMouseLeave = {AccountBoxOnMouseLeave}
                >
                    <div className="head">
                        <div className="img-container">
                            <FaUserAlt id = "default-user-icon"/>
                        </div>
                        <p>{auth.user || "Guest"}</p>
                    </div>
                    {auth.user ? <Link to = "/admin">To Admin Page</Link>
                            : <Link to = "/login">Log in</Link>                
                    }
                </div>

                <Button id = "more-button" callback = {() => setAppStates(true, false, "resources-screen", false)}><IoIosMore id = "more-icon"/></Button>
                <Button id = "contact-button"><GrContact id = "contact-icon"/></Button>
                <Button id = "info-button" callback = {() => setAppStates(true, false, "inspiration-screen", false)}><FaInfo id = "info-icon"/></Button>
                <Button id = "share-button" callback = {() => setAppStates(true, false, "share-screen", false)}><FaPenToSquare />Share your feelings</Button>
                <Button id = "campfire-button" callback = {() => setAppStates(true, false, "campfire-screen", false)}><GiCampfire id = "campfire-icon"/></Button>

                {displayHint &&
                <div className="info-bubble">
                    <div className="head">
                        <IoIosInformationCircle id = "popup-info-icon"/>
                        <span>Did you know?</span>
                    </div>
                    <p>See more by <b>Hover</b> or <b>Click</b> on <i>Posts</i></p>
                </div>}

            </div>
        </PostsState.Provider>
    )
}

export { PostsState };