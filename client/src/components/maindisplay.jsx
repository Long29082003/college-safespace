// Todo: Work on the titling of the .main-display. ✅
// Todo: Ask chatgpt about how to delete Post after aniamtion. ✅
// Todo: Create a submit button ✅
// Todo: Work on creating a form sequence ✅
// Todo: Create a simple backend to store the form data
// Todo: Display the rolling data
import "../styles/maindisplay.css";
import { IoIosMore } from "react-icons/io";
import { GrContact } from "react-icons/gr";
import { FaInfo } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";

import { Button } from "../utilcomponents/button.jsx";
import { Post } from "../utilcomponents/post.jsx";
import { useRef, useContext } from "react";
import { States } from "../App.jsx";

import { tilting } from "../utilFunctions/utils.js";

export function MainDisplay() {
    //? States passed from App level
    const states = useContext(States);
    const isScrolling = states.isScrolling;

    //? Ref
    const tiltingContainer = useRef(null);

    const handleOnMouseMove = (event) => {
        if (!isScrolling) return;
        tilting(event, tiltingContainer, 0.07, 10);
    };

    return (
        <div className="main-display" onMouseMove = {handleOnMouseMove} >
            <div className="tilting-container" ref = {tiltingContainer}>
                <div className="scrolling-container">
                    <Post />
                </div>
            </div>

            <Button id = "more-button"><IoIosMore id = "more-icon"/></Button>
            <Button id = "contact-button"><GrContact id = "contact-icon"/></Button>
            <Button id = "info-button"><FaInfo id = "info-icon"/></Button>
            <Button id = "share-button" callback = {states.buttonClicked}><FaPenToSquare />Share your feelings</Button>
        </div>
    )
}