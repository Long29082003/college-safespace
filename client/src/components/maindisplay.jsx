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
// Todo: Work on Inspiration page
// Todo: Maybe watch video to see scroll animation

// * The way the setTimeout work is that its like a ticking bomb. After the interval
// * the bomb will explode take one post from queue put it in animating list and becasue
// * the queue change the bomb is planted again. But if we just depends the setTimeout
// * on the change in queue then what happens if we fetch for more data from the database and add it to the queue?
import "../styles/maindisplay.css";
import { IoIosMore } from "react-icons/io";
import { GrContact } from "react-icons/gr";
import { FaInfo } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid"; 

import { Button } from "../utilcomponents/button.jsx";
import { Post } from "../utilcomponents/post.jsx";
import { useState, useRef, useContext, useEffect } from "react";
import { States } from "../App.jsx";

import { tilting } from "../utilFunctions/utils.js";

export function MainDisplay() {
    //? States passed from App level
    const states = useContext(States);
    const isScrolling = states.isScrolling;
    const [postsQueue, setPostsQueue] = useState([]);
    const [animatingPosts, setAnimatingPosts] = useState([]);
    
    //? Ref
    const tiltingContainer = useRef(null);
    const intervalRef = useRef(null);
    //* These following refs are anchors used to search the database
    const earliestPostTime = useRef("");
    const latestPostTime = useRef("");
    const latestPostId = useRef("");
    const reachEndDB = useRef(false);

    const intervalToDisplayPosts = 6000;

    //? useEffect
    //* Fetch posts into queue after the queue run low
    useEffect(() => {
        async function fetchPosts (limit) {
            const respond = await fetch(`/api/get/post?limit=${limit}&earliest_time=${earliestPostTime.current && earliestPostTime.current.toISOString() || ""}&latest_time=${latestPostTime.current && latestPostTime.current.toISOString() || ""}&latest_id=${latestPostId.current}`);
            if (respond) {
                const data = await respond.json();
                console.log(`Fetch posts: `, data.posts);
                
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

    useEffect(() => {
        if (!isScrolling) {
            return;
        };

        if (postsQueue.length === 0) return;

        intervalRef.current = setInterval(() => {
            const post = postsQueue[0];
            setAnimatingPosts(prev => {
                return [
                    ...prev,
                    <Post key = {uuidv4()} postInfo={post}/>
                ];
            });
            setPostsQueue(prev => prev.slice(1));
        }, intervalToDisplayPosts);

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [postsQueue, isScrolling]);

    const handleOnMouseMove = (event) => {
        if (!isScrolling) return;
        tilting(event, tiltingContainer, 0.07, 10);
    };

    return (
        <div className="main-display" onMouseMove = {handleOnMouseMove} >
            <div className="tilting-container" ref = {tiltingContainer}>
                <div className="scrolling-container">
                    {animatingPosts}
                </div>
            </div>

            <Button id = "more-button"><IoIosMore id = "more-icon"/></Button>
            <Button id = "contact-button"><GrContact id = "contact-icon"/></Button>
            <Button id = "info-button"><FaInfo id = "info-icon"/></Button>
            <Button id = "share-button" callback = {states.buttonClicked}><FaPenToSquare />Share your feelings</Button>
        </div>
    )
}